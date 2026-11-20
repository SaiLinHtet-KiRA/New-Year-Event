export type ParticipantStatus = "Registered" | "Won" | "Prize collected";
export type WinnerStatus = "Won" | "Prize collected";

export interface Participant {
  _id: string;
  employeeId: string;
  fullName: string;
  department: string;
  registeredAt: string;
  status: ParticipantStatus;
}

export interface PrizeConfig {
  name: string;
  count: number;
}

export interface EventConfig {
  _id: string;
  title: string;
  prizes: PrizeConfig[];
  registrationClosesAt: string;
  drawAt: string | null;
  publishedAt: string | null;
  published: boolean;
}

export interface Winner {
  _id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  prize: string;
  status: WinnerStatus;
  drawnAt: string;
  collectedAt: string | null;
  handedBy: string | null;
}

export interface DashboardStats {
  participants: number;
  registered: number;
  winners: number;
  collected: number;
  pending: number;
  departments: number;
  collectionRate: number;
}

export interface ParticipantPage {
  items: Participant[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  departments: string[];
}

export interface PrizeReportRow {
  prize: string;
  winners: number;
  collected: number;
  pending: number;
  progress: number;
}

export interface ReportData {
  stats: DashboardStats;
  byPrize: PrizeReportRow[];
  generatedAt: string;
  generatedBy: string;
}

export type ResultState =
  | { status: "idle" }
  | { status: "not-registered"; message: string }
  | { status: "not-published"; message: string }
  | { status: "not-selected"; message: string }
  | { status: "won"; employeeName: string; prize: string; collected: boolean }
  | { status: "error"; message: string };

export interface FormState {
  status: "idle" | "success" | "error";
  message: string;
}
