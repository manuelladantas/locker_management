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
			throw new Error();
		}
	}
}
