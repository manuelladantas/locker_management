import { randomUUID } from 'crypto';
import { Rent, RentSize, RentStatus } from '../domain/rent/rent';
import IRentRepo from '../domain/rent/rent.repo';
import { RentRepository } from '../infrastructure/repositories/rent.repository';

export interface IRentService {}

export class RentService implements IRentService {
	constructor(private repo: IRentRepo) {
		this.repo = new RentRepository();
	}

	async dropOffRent(id: string): Promise<void> {
		this.repo.updateById(id, {
			status: RentStatus.WAITING_PICKUP,
		});
	}

	async pickUpRent(id: string): Promise<void> {
		this.repo.updateById(id, {
			status: RentStatus.DELIVERED,
		});
	}

	async setRentToLocker(id: string): Promise<void> {
		this.repo.updateById(id, {
			status: RentStatus.WAITING_DROPOFF,
		});
	}

	async createRent(weight: number, size: RentSize): Promise<Rent> {
		return this.repo.createRent({
			id: randomUUID(),
			lockerId: null,
			weight,
			size,
			status: RentStatus.WAITING_DROPOFF,
		});
	}
}
