import fastify from 'fastify';
import { bloqRoutes } from '../../presentation/bloq.fastify';
import { rentRoutes } from '../../presentation/rent.fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { lockerRoutes } from '../../presentation/locker.fastify';

const server = fastify();

server.register(rentRoutes);
server.register(bloqRoutes);
server.register(lockerRoutes);

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

export const start = async () => {
	try {
		console.log('routes listening', server.printRoutes());
		server.listen({ port: 8080 }, (err, address) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			console.log(`Server listening at ${address}`);
		});
	} catch (error) {
		process.exit(1);
	}
};

export default server;
