import { z } from "zod";

export const websiteUrlSchema = z.object({
    url: z.string().min(1, "url must be provided")
})
