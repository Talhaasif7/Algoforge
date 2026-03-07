import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string().min(1, "Name is required").max(100).optional(),
    avatar: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
    bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
