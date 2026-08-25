import { z } from "zod";

export const platformEnum = z.enum(["INSTAGRAM", "FACEBOOK", "LINKEDIN"]);

export const createPostSchema = z.object({
  imageUrl: z
    .string()
    .min(1, "Please upload an image first")
    .url("Invalid image URL"),
  caption: z
    .string()
    .max(2200, "Caption cannot exceed 2,200 characters")
    .optional()
    .default(""),
  platforms: z
    .array(platformEnum)
    .min(1, "Select at least one platform"),
  scheduledAt: z
    .string()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime()) && date.getTime() > Date.now();
    }, "Scheduled time must be in the future")
    .optional()
    .nullable(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
