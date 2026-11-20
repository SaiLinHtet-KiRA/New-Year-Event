import { randomInt } from "node:crypto";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "new_year_prize_draw";
const staff = process.env.HR_STAFF_NAME ?? "HR Staff";
const PARTICIPANT_COUNT = 80;
const PRIZE_COUNT = 100;

const firstNames = [
  "Alex", "Priya", "Jordan", "Maria", "Wei", "Sam", "Fatima", "Liam",
  "Nina", "Diego", "Emma", "Kwame", "Sofia", "Haruto", "Olivia", "Ravi",
  "Chloe", "Daniel", "Aisha", "Marco",
];
const lastNames = [
  "Morgan", "Sharma", "Lee", "Garcia", "Chen", "Taylor", "Hassan", "O'Brien",
  "Patel", "Rossi", "Wilson", "Mensah", "Andersson", "Sato", "Brown", "Khan",
  "Dubois", "Kim", "Novak", "Silva",
];
const departments = [
  "Finance", "Engineering", "Marketing", "Operations",
  "HR", "Sales", "Support", "Legal",
];

const people = Array.from({ length: PARTICIPANT_COUNT }, (_, index) => [
  `EMP-${1001 + index}`,
  `${firstNames[index % firstNames.length]} ${lastNames[Math.floor(index / firstNames.length) % lastNames.length]}`,
  departments[index % departments.length],
]);

const prizes = Array.from({ length: PRIZE_COUNT }, (_, index) => ({
  name:
    index === 0
      ? "Grand Prize"
      : index === 1
        ? "Second Prize"
        : index === 2
          ? "Third Prize"
          : `Lucky Prize ${String(index - 2).padStart(2, "0")}`,
  count: 1,
}));

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);
  const participants = db.collection("participants");
  const winners = db.collection("winners");
  const events = db.collection("events");

  const now = Date.now();
  const participantDocs = people.map(([employeeId, fullName, department], index) => ({
    _id: employeeId,
    employeeId,
    fullName,
    department,
    registeredAt: new Date(now - (people.length - index) * 3_600_000).toISOString(),
    status: "Registered",
  }));

  await participants.deleteMany({
    _id: { $nin: participantDocs.map((doc) => doc._id) },
  });
  await Promise.all(
    participantDocs.map((doc) =>
      participants.replaceOne({ _id: doc._id }, doc, { upsert: true }),
    ),
  );

  const shuffled = [...participantDocs];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const slots = prizes.flatMap((prize) =>
    Array.from({ length: prize.count }, () => prize.name),
  );
  const drawnAt = new Date(now - 1_800_000).toISOString();
  const winnerDocs = shuffled.slice(0, slots.length).map((person, index) => ({
    _id: person.employeeId,
    employeeId: person.employeeId,
    employeeName: person.fullName,
    department: person.department,
    prize: slots[index],
    status: "Won",
    drawnAt,
    collectedAt: null,
    handedBy: null,
  }));

  for (const [index, winner] of winnerDocs.entries()) {
    if (index % 3 === 0) {
      winner.status = "Prize collected";
      winner.collectedAt = new Date(now - 900_000 + index * 60_000).toISOString();
      winner.handedBy = staff;
    }
  }

  await winners.deleteMany({});
  await winners.insertMany(winnerDocs);

  for (const winner of winnerDocs) {
    await participants.updateOne(
      { _id: winner.employeeId },
      { $set: { status: winner.status } },
    );
  }

  await events.replaceOne(
    { _id: "new-year-draw" },
    {
      _id: "new-year-draw",
      title: "New Year Prize Draw",
      prizes,
      registrationClosesAt: "2027-01-31T23:59:59.000Z",
      drawAt: drawnAt,
      publishedAt: new Date(now - 1_500_000).toISOString(),
      published: true,
    },
    { upsert: true },
  );

  console.log(
    `Seeded ${participantDocs.length} participants, ${prizes.length} prizes, ${winnerDocs.length} winners (${winnerDocs.filter((w) => w.status === "Prize collected").length} collected).`,
  );
} finally {
  await client.close();
}
