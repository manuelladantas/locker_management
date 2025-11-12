import fastify from 'fastify';
import { bloqRoutes } from '../../presentation/bloq.fastify';

const server = fastify();

server.register(bloqRoutes);

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
