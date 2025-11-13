import { Bloq } from '../../domain/bloq/bloq';
import IBloqRepo from '../../domain/bloq/bloq.repo';
import { readFile } from 'fs/promises';

export class BloqRepository implements IBloqRepo {
	constructor() {}

	private readonly filePath = './src/infrastructure/data/bloqs.json';

	async getBloqs(): Promise<Bloq[]> {
		try {
			const fileContent = await readFile(this.filePath, 'utf-8');

			const data = JSON.parse(fileContent);

			return data as Bloq[];
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async getBloqById(id: string): Promise<Bloq | undefined> {
		try {
			const bloqs = await this.getBloqs();
			const item = bloqs.find((bloq) => bloq.id === id);
			return item;
		} catch (error) {
			console.error('Error finding bloq by ID:', error);
			throw error;
		}
	}
}
