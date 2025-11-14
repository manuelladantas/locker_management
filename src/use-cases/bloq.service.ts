import { Bloq } from '../domain/bloq/bloq';
import IBloqRepo from '../domain/bloq/bloq.repo';
import { BloqRepository } from '../infrastructure/repositories/bloq.repository';

export interface IBloqService {
	getAllBloqs(): Promise<Bloq[]>;
	getBloqAddress(id: string): Promise<String>;
}

export class BloqService implements IBloqService {
	constructor(private repo: IBloqRepo) {
		this.repo = new BloqRepository();
	}

	async getAllBloqs(): Promise<Bloq[]> {
		return this.repo.getBloqs();
	}

	async getBloqAddress(id: string): Promise<String> {
		const bloq = await this.repo.getBloqById(id);

		if (!bloq) {
			throw Error('this bloq doesnt exist');
		}

		return bloq.address;
	}
}
