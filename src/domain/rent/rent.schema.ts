import z from 'zod';
import { RentSize } from './rent';

export const RentSchema = z.object({
	weight: z.number(),
	size: z.enum(RentSize),
});

export type RentBody = z.infer<typeof RentSchema>;
