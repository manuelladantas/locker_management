import { FastifyInstance } from 'fastify';
import { LockerService } from '../use-cases/locker.service';
import {
	OpenLockerBody,
	OpenLockerSchema,
	SetRentToLockerBody,
	SetRentToLockerSchema,
} from '../domain/locker/locker.schema';

export async function lockerRoutes(fastify: FastifyInstance) {
	const service = new LockerService();

	fastify.post('/locker/availableLocker/:rentId', async (req) => {
		try {
			const { rentId } = req.params as { rentId: string };

			const info = await service.getAvailableLocker(rentId);

			return { ok: true, data: { info } };
		} catch (error) {
			return { ok: false, data: { error } };
		}
	});

	fastify.post(
		'/locker/open/:id',
		{
			schema: OpenLockerSchema,
		},
		async (req) => {
			try {
				const { id } = req.params as { id: string };
				const { password } = req.body as OpenLockerBody;

				await service.openLocker(id, password);

				return { ok: true, data: { open: true } };
			} catch (error) {
				return { ok: false, data: { open: false } };
			}
		},
	);

	fastify.post(
		'/locker/setRentToLocker/:rentId',
		{
			schema: { body: SetRentToLockerSchema },
		},
		async (request) => {
			try {
				const { rentId } = request.params as { rentId: string };
				const { lockerId } = request.body as SetRentToLockerBody;

				const settedRent = await service.setRentToLocker(rentId, lockerId);

				return { ok: true, data: settedRent };
			} catch (error) {
				return { ok: false, data: { error } };
			}
		},
	);

	fastify.patch('/locker/close/:id', async (req) => {
		const { id } = req.params as { id: string };
		await service.closeLocker(id);

		return { ok: true, data: { closed: true } };
	});

	fastify.post('/locker/pickupRent/:id', async (request) => {
		try {
			const { id } = request.params as { id: string };

			await service.pickUpRent(id);

			return { ok: true, data: { info: 'rent delivered' } };
		} catch (error) {
			return { ok: false, data: { error } };
		}
	});
}
