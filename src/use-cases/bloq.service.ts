import { Bloq } from '../domain/bloq/bloq';
import IBloqRepo from '../domain/bloq/bloq.repo';
import { BloqRepository } from '../infrastructure/repositories/bloq.repository';

export interface IBloqService {
	getAllBloqs(): Promise<Bloq[]>;
}

export class BloqService implements IBloqService {
	constructor(private repo: IBloqRepo) {
		this.repo = repo;
	}

	async getAllBloqs(): Promise<Bloq[]> {
		return this.repo.getBloqs();
	}
}
