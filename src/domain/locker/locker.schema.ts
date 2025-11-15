import z from 'zod';

export const OpenLockerSchema = z.object({
	password: z.string(),
});

export const SetRentToLockerSchema = z.object({
	lockerId: z.string(),
});

export type SetRentToLockerBody = z.infer<typeof SetRentToLockerSchema>;
export type OpenLockerBody = z.infer<typeof OpenLockerSchema>;
