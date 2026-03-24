import { z } from "zod";

export const ticketSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  description: z.string().min(10, "Description too short"),
  image: z.any().optional()
});

export type TicketFormData = z.infer<typeof ticketSchema>;