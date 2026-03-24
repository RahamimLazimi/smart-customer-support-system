export interface Ticket {
  id: string;
  name: string;
  email: string;
  description: string;
  status: TicketStatus;
  summary?: string;
  resolution?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const TICKET_STATUSES = [
  "Open",
  "In Progress",
  "Closed",
  "New",
  "Resolved"
] as const;

export type TicketStatus = typeof TICKET_STATUSES[number];