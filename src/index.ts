import { start } from './infrastructure/server/fastify';

const container = async (): Promise<void> => {
	await start();
};

container();
