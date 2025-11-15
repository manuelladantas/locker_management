import { FastifyInstance } from 'fastify';
import { BloqRepository } from '../infrastructure/repositories/bloq.repository';
import { BloqService } from '../use-cases/bloq.service';

export async function bloqRoutes(fastify: FastifyInstance) {
	const service = new BloqService();

	fastify.get('/bloqs', async () => {
		return await service.getAllBloqs();
	});
}
