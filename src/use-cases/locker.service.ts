import { randomUUID } from 'crypto';
import IBloqRepo from '../domain/bloq/bloq.repo';
import { Locker, LockerStatus } from '../domain/locker/locker';
import ILockerRepo from '../domain/locker/locker.repo';
import { Rent, RentStatus } from '../domain/rent/rent';
import IRentRepo from '../domain/rent/rent.repo';
import { Secret, SecretStatus } from '../domain/secrets/secrets';
import ISecretRepo from '../domain/secrets/secrets.repo';
import { BloqRepository } from '../infrastructure/repositories/bloq.repository';
import { LockerRepository } from '../infrastructure/repositories/locker.repository';
import { RentRepository } from '../infrastructure/repositories/rent.repository';
import { SecretsRepository } from '../infrastructure/repositories/secrets.repository';

export interface ILockerService {
	openLocker(id: string, password: string): Promise<Locker>;
	closeLocker(id: string): Promise<Locker>;
	getAvailableLocker(rentId: string): Promise<string>;
	pickUpRent(id: string): Promise<void>;
	setRentToLocker(id: string, lockerId: string): Promise<void>;
}

export class LockerService implements ILockerService {
	private secretRepo: ISecretRepo;
	private bloqRepo: IBloqRepo;
	private repo: ILockerRepo;
	private rentRepo: IRentRepo;
	constructor() {
		this.repo = new LockerRepository();
		this.secretRepo = new SecretsRepository();
		this.bloqRepo = new BloqRepository();
		this.rentRepo = new RentRepository();
	}

	async openLocker(id: string, password: string): Promise<Locker> {
		const secret = await this.secretRepo.getSecret(id, password);

		if (!secret) {
			throw new Error('Wrong secret');
		}

		return this.repo.updateById(id, {
			status: LockerStatus.OPEN,
		});
	}

	async closeLocker(id: string): Promise<Locker> {
		return this.repo.updateById(id, {
			status: LockerStatus.CLOSED,
		});
	}

	async getAvailableLocker(rentId: string): Promise<string> {
		const rent = await this.rentRepo.getRentById(rentId);

		if (!rent) {
			throw new Error('Cannot find rent');
		}
		const availableLocker = await this.repo.getMatchedLocker(rent.weight);

		if (!availableLocker) {
			throw new Error('all lockers are occupied');
		}
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		const secret: Secret = {
			id: randomUUID(),
			lockerId: availableLocker.id,
			status: SecretStatus.ENABLE,
			password: code,
		};
		this.secretRepo.createSecret(secret);
		this.rentRepo.updateById(rentId, {
			status: RentStatus.WAITING_DROPOFF,
		});

		const bloq = await this.bloqRepo.getBloqById(availableLocker.bloqId);

		return `lockerId: ${availableLocker.id} - secret: ${secret.password} - bloq address: ${bloq?.address}`;
	}

	async pickUpRent(id: string): Promise<void> {
		const rent = await this.rentRepo.updateById(id, {
			status: RentStatus.DELIVERED,
		});

		if (!rent.lockerId) {
			throw new Error('This rent doesnt have a locker associated');
		}

		this.repo.updateById(rent.lockerId, {
			isOccupied: false,
		});

		const secret = await this.secretRepo.getActiveSecret(rent.lockerId);

		this.secretRepo.updateById(secret.id, {
			status: SecretStatus.DISABLED,
		});
	}

	async setRentToLocker(id: string, lockerId: string): Promise<void> {
		const rent = await this.rentRepo.updateById(id, {
			status: RentStatus.WAITING_PICKUP,
			lockerId: lockerId,
		});

		if (!rent) {
			throw new Error('Cannot updated rent status');
		}

		this.repo.updateById(lockerId, {
			isOccupied: true,
		});
	}
}
