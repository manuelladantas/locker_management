import { FastifyInstance } from 'fastify';

import { RentService } from '../use-cases/rent.service';
import { RentBody, RentSchema } from '../domain/rent/rent.schema';
import { RentRepository } from '../infrastructure/repositories/rent.repository';

export async function rentRoutes(fastify: FastifyInstance) {
	const service = new RentService(new RentRepository());

	fastify.post(
		'/rent',
		{
			schema: { body: RentSchema },
		},
		async (request) => {
			const rentShape = request.body as RentBody;

			const createdRent = await service.createRent(rentShape.weight, rentShape.size);

			return { ok: true, data: createdRent };
		},
	);
}
