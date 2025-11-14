import { RentRepository } from '../infrastructure/repositories/rent.repository';

export interface IRentService {}

export class RentService implements IRentService {
	constructor(private repo: IRentService) {
		this.repo = new RentRepository();
	}

	async dropOffRent(): Promise<void> {}
}
