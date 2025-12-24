import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description required"),
  priority: z.string().min(1, "Role is required"),
  status: z.string().min(1, "Status is required"),
  team: z.string().min(1, "Team No required"),
  tasks: z.object({
    completed: z.string().min(1, "No of completed required"),
    total: z.string().min(1, "No of total required"),
  }),
  deadline: z.string().min(1, "Deadline is required"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
