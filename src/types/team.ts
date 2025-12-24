import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  status: z.string().min(1, "Status is required"),
  avatarColor: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof memberSchema>;
