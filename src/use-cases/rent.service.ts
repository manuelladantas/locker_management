import { randomUUID } from 'crypto';
import { Rent, RentSize, RentStatus } from '../domain/rent/rent';
import IRentRepo from '../domain/rent/rent.repo';
import { RentRepository } from '../infrastructure/repositories/rent.repository';

export interface IRentService {
	createRent(weight: number, size: RentSize): Promise<Rent>;
}

export class RentService implements IRentService {
	private repo: IRentRepo;
	constructor() {
		this.repo = new RentRepository();
	}

	async createRent(weight: number, size: RentSize): Promise<Rent> {
		return this.repo.createRent({
			id: randomUUID(),
			lockerId: null,
			weight,
			size,
			status: RentStatus.CREATED,
		});
	}
}
