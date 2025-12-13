import { z } from 'zod';

export const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

export const serviseSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    category_id: z.string(),
    city_id: z.string(),
});
