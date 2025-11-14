import IBloqRepo from '../domain/bloq/bloq.repo';
import { LockerStatus } from '../domain/locker/locker';
import ILockerRepo from '../domain/locker/locker.repo';
import { Rent } from '../domain/rent/rent';
import { Secret, SecretStatus } from '../domain/secrets/secrets';
import ISecretRepo from '../domain/secrets/secrets.repo';
import { LockerRepository } from '../infrastructure/repositories/locker.repository';
import { SecretsRepository } from '../infrastructure/repositories/secrets.repository';

export interface ILockerService {}

export class LockerService implements ILockerService {
	constructor(
		private repo: ILockerRepo,
		private secretRepo: ISecretRepo,
		private bloqRepo: IBloqRepo,
	) {
		this.repo = new LockerRepository();
		this.secretRepo = new SecretsRepository();
	}

	async openLocker(id: string, password: string): Promise<void> {
		const secret = this.secretRepo.getSecret(id, password);

		if (!secret) {
			throw new Error('Wrong secret');
		}

		this.repo.updateById(id, {
			status: LockerStatus.OPEN,
		});
	}

	async closeLocker(id: string): Promise<void> {
		this.repo.updateById(id, {
			status: LockerStatus.CLOSED,
		});
	}
	//receive rent and return a locker with a secret
	async getAvailableLocker(rent: Rent) {
		const availableLocker = await this.repo.getMatchedLocker(rent.weight);

		if (!availableLocker) {
			throw new Error('all lockers are occupied');
		}
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		const secret: Secret = {
			lockerId: availableLocker.id,
			status: SecretStatus.ENABLE,
			password: code,
		};
		this.secretRepo.createSecret(secret);

		const bloq = await this.bloqRepo.getBloqById(availableLocker.bloqId);

		return `${availableLocker.id} - ${secret.password} - ${bloq?.address}`;
	}
}
