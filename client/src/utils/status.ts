import { TICKET_STATUSES } from "../types/ticket";

export function normalizeStatus(status: string): string {
  return TICKET_STATUSES.includes(status as any)
    ? status
    : "Default";
}