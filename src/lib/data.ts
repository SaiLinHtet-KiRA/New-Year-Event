import "server-only";

import { randomInt } from "node:crypto";
import type { Filter } from "mongodb";
import { HR_STAFF_NAME } from "./config";
import { getDb } from "./mongodb";
import type {
  DashboardStats,
  EventConfig,
  Participant,
  ParticipantPage,
  ParticipantStatus,
  ReportData,
  ResultState,
  Winner,
} from "./types";

const EVENT_ID = "new-year-draw";
const DEFAULT_PRIZES = [
  { name: "Grand Prize", count: 1 },
  { name: "Second Prize", count: 2 },
  { name: "Consolation Prize", count: 3 },
];
const DEFAULT_REGISTRATION_CLOSE = "2027-01-31T23:59:59.000Z";
const PAGE_SIZE = 8;

export async function getEvent(): Promise<EventConfig> {
  const events = (await getDb()).collection<EventConfig>("events");

  await events.updateOne(
    { _id: EVENT_ID },
    {
      $setOnInsert: {
        title: "New Year Prize Draw",
        prizes: DEFAULT_PRIZES,
        registrationClosesAt: DEFAULT_REGISTRATION_CLOSE,
        drawAt: null,
        publishedAt: null,
        published: false,
      },
    },
    { upsert: true },
  );

  const event = await events.findOne({ _id: EVENT_ID });
  if (!event) throw new Error("Could not load the prize draw event.");
  return event;
}

export async function addPrize(nameRaw: string, countRaw: number): Promise<void> {
  const name = nameRaw.trim();
  const count = Math.trunc(countRaw);

  if (!name) throw new Error("Prize name is required.");
  if (!Number.isFinite(count) || count < 1 || count > 1000) {
    throw new Error("Number of prizes must be between 1 and 1000.");
  }

  const event = await getEvent();
  if (event.prizes.some((prize) => prize.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("A prize with this name already exists.");
  }

  await (await getDb()).collection<EventConfig>("events").updateOne(
    { _id: EVENT_ID },
    { $push: { prizes: { name, count } } },
  );
}

export async function getParticipants(options: {
  query?: string;
  department?: string;
  page?: number;
} = {}): Promise<ParticipantPage> {
  const participants = (await getDb()).collection<Participant>("participants");
  const query = options.query?.trim() ?? "";
  const department = options.department?.trim() ?? "";
  const page = Math.max(1, Math.trunc(options.page ?? 1));

  const filter: Filter<Participant> = {};
  if (department && department !== "All departments") {
    filter.department = department;
  }
  if (query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { employeeId: { $regex: escaped, $options: "i" } },
      { fullName: { $regex: escaped, $options: "i" } },
    ];
  }

  const [items, total, departments] = await Promise.all([
    participants
      .find(filter)
      .sort({ registeredAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray(),
    participants.countDocuments(filter),
    participants.distinct("department"),
  ]);

  return {
    items,
    total,
    page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    departments: departments.sort((a, b) => a.localeCompare(b)),
  };
}

export async function registerParticipant(input: {
  employeeId: string;
  fullName: string;
  department: string;
}): Promise<void> {
  const employeeId = input.employeeId.trim().toUpperCase();
  const fullName = input.fullName.trim();
  const department = input.department.trim();

  if (!employeeId || !fullName || !department) {
    throw new Error("Employee ID, full name and department are required.");
  }

  const event = await getEvent();
  if (new Date(event.registrationClosesAt).getTime() <= Date.now()) {
    throw new Error("Registration for the prize draw has closed.");
  }

  const participants = (await getDb()).collection<Participant>("participants");
  const existing = await participants.findOne({ _id: employeeId });
  if (existing) {
    throw new Error("This employee ID is already registered.");
  }

  await participants.insertOne({
    _id: employeeId,
    employeeId,
    fullName,
    department,
    registeredAt: new Date().toISOString(),
    status: "Registered",
  });
}

export async function checkResult(employeeIdRaw: string): Promise<ResultState> {
  const employeeId = employeeIdRaw.trim().toUpperCase();
  if (!employeeId) return { status: "error", message: "Enter your employee ID." };

  const db = await getDb();
  const participant = await db
    .collection<Participant>("participants")
    .findOne({ _id: employeeId });
  if (!participant) {
    return {
      status: "not-registered",
      message: "No registration found for this employee ID.",
    };
  }

  const event = await getEvent();
  if (!event.published) {
    return {
      status: "not-published",
      message: "The winner list has not been published yet. Please check back later.",
    };
  }

  const winner = await db.collection<Winner>("winners").findOne({ _id: employeeId });
  if (!winner) {
    return {
      status: "not-selected",
      message: "Not selected this time. Thank you for taking part.",
    };
  }

  return {
    status: "won",
    employeeName: winner.employeeName,
    prize: winner.prize,
    collected: winner.status === "Prize collected",
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = await getDb();
  const participants = db.collection<Participant>("participants");
  const winners = db.collection<Winner>("winners");

  const [participantCount, registered, winnerCount, collected, departments] =
    await Promise.all([
      participants.countDocuments(),
      participants.countDocuments({ status: "Registered" }),
      winners.countDocuments(),
      winners.countDocuments({ status: "Prize collected" }),
      participants.distinct("department"),
    ]);

  return {
    participants: participantCount,
    registered,
    winners: winnerCount,
    collected,
    pending: winnerCount - collected,
    departments: departments.length,
    collectionRate:
      winnerCount === 0 ? 0 : Math.round((collected / winnerCount) * 100),
  };
}

export async function runDraw(): Promise<number> {
  const db = await getDb();
  const event = await getEvent();
  const participants = await db
    .collection<Participant>("participants")
    .find()
    .toArray();

  if (participants.length === 0) {
    throw new Error("No participants are registered yet.");
  }

  const slots = event.prizes.flatMap((prize) =>
    Array.from({ length: Math.max(0, prize.count) }, () => prize.name),
  );
  if (slots.length === 0) {
    throw new Error("No prizes have been configured.");
  }

  const shuffled = [...participants];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, Math.min(slots.length, shuffled.length));
  const drawnAt = new Date().toISOString();
  const winnerDocs: Winner[] = selected.map((participant, index) => ({
    _id: participant.employeeId,
    employeeId: participant.employeeId,
    employeeName: participant.fullName,
    department: participant.department,
    prize: slots[index],
    status: "Won",
    drawnAt,
    collectedAt: null,
    handedBy: null,
  }));

  await db.collection<Winner>("winners").deleteMany({});
  if (winnerDocs.length > 0) {
    await db.collection<Winner>("winners").insertMany(winnerDocs);
  }

  const participantCollection = db.collection<Participant>("participants");
  await participantCollection.updateMany(
    {},
    { $set: { status: "Registered" as ParticipantStatus } },
  );
  await participantCollection.updateMany(
    { _id: { $in: selected.map((participant) => participant.employeeId) } },
    { $set: { status: "Won" as ParticipantStatus } },
  );

  await db.collection<EventConfig>("events").updateOne(
    { _id: EVENT_ID },
    { $set: { drawAt: drawnAt, published: false, publishedAt: null } },
  );

  return winnerDocs.length;
}

export async function publishWinners(): Promise<void> {
  const event = await getEvent();
  if (!event.drawAt) throw new Error("Run the draw before publishing winners.");

  await (await getDb()).collection<EventConfig>("events").updateOne(
    { _id: EVENT_ID },
    { $set: { published: true, publishedAt: new Date().toISOString() } },
  );
}

export async function getWinners(): Promise<Winner[]> {
  const winners = (await getDb()).collection<Winner>("winners");
  return winners.find().sort({ drawnAt: -1, prize: 1 }).toArray();
}

export async function findWinner(employeeIdRaw: string): Promise<Winner | null> {
  const employeeId = employeeIdRaw.trim().toUpperCase();
  if (!employeeId) return null;
  return (await getDb()).collection<Winner>("winners").findOne({ _id: employeeId });
}

export async function markCollected(
  employeeIdRaw: string,
  handedByRaw: string,
): Promise<void> {
  const employeeId = employeeIdRaw.trim().toUpperCase();
  const handedBy = handedByRaw.trim() || HR_STAFF_NAME;

  const db = await getDb();
  const winner = await db.collection<Winner>("winners").findOne({ _id: employeeId });
  if (!winner) throw new Error("No winner found for this employee ID.");
  if (winner.status === "Prize collected") {
    throw new Error("This prize has already been collected.");
  }

  const collectedAt = new Date().toISOString();
  await db.collection<Winner>("winners").updateOne(
    { _id: employeeId },
    { $set: { status: "Prize collected", collectedAt, handedBy } },
  );
  await db.collection<Participant>("participants").updateOne(
    { _id: employeeId },
    { $set: { status: "Prize collected" } },
  );
}

export async function getRecentlyCollected(limit = 5): Promise<Winner[]> {
  const winners = (await getDb()).collection<Winner>("winners");
  return winners
    .find({ status: "Prize collected" })
    .sort({ collectedAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getReport(): Promise<ReportData> {
  const [event, stats, winners] = await Promise.all([
    getEvent(),
    getDashboardStats(),
    getWinners(),
  ]);

  const prizeNames = new Set([
    ...event.prizes.map((prize) => prize.name),
    ...winners.map((winner) => winner.prize),
  ]);

  const byPrize = Array.from(prizeNames).map((prize) => {
    const rows = winners.filter((winner) => winner.prize === prize);
    const collected = rows.filter(
      (winner) => winner.status === "Prize collected",
    ).length;
    return {
      prize,
      winners: rows.length,
      collected,
      pending: rows.length - collected,
      progress: rows.length === 0 ? 0 : Math.round((collected / rows.length) * 100),
    };
  });

  return {
    stats,
    byPrize,
    generatedAt: new Date().toISOString(),
    generatedBy: HR_STAFF_NAME,
  };
}
