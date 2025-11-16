import { LockerStatus } from '../../domain/locker/locker';
import { RentSize, RentStatus } from '../../domain/rent/rent';
import { SecretStatus } from '../../domain/secrets/secrets';
import { BloqRepository } from '../../infrastructure/repositories/bloq.repository';
import { LockerRepository } from '../../infrastructure/repositories/locker.repository';
import { RentRepository } from '../../infrastructure/repositories/rent.repository';
import { SecretsRepository } from '../../infrastructure/repositories/secrets.repository';
import { ILockerService, LockerService } from '../locker.service';

jest.mock('fs/promises', () => ({
	writeFile: jest.fn(),
	readFile: jest.fn(),
}));
describe('lockerService', () => {
	let instance: ILockerService;

	const mockSecrets = [
		{
			id: 'c1f04109-a9b1-43c4-989f-48c23386ae20',
			lockerId: '8b4b59ae-8de5-4322-a426-79c29315a9f1',
			status: SecretStatus.ENABLE,
			password: '403703',
		},
		{
			id: '466201da-890e-4e47-80a0-61d5ba0d0883',
			lockerId: '1b8d1e89-2514-4d91-b813-044bf0ce8d20',
			status: SecretStatus.ENABLE,
			password: '095494',
		},
	];

	const mockLockers = [
		{
			id: '1b8d1e89-2514-4d91-b813-044bf0ce8d20',
			bloqId: '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510',
			status: LockerStatus.CLOSED,
			isOccupied: false,
			maxWeight: 50,
		},
		{
			id: '8b4b59ae-8de5-4322-a426-79c29315a9f1',
			bloqId: '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510',
			status: LockerStatus.CLOSED,
			isOccupied: false,
			maxWeight: 20,
		},
		{
			id: 'c9b16a02-7df1-41f2-99af-1cd5b790c29e',
			bloqId: '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510',
			status: LockerStatus.OPEN,
			isOccupied: false,
			maxWeight: 20,
		},
	];

	const mockRents = [
		{
			id: '84ba232e-ce23-4d8f-ae26-68616600df48',
			lockerId: null,
			weight: 10,
			size: RentSize.XL,
			status: RentStatus.CREATED,
		},
		{
			id: 'feb72a9a-258d-49c9-92de-f90b1f11984d',
			lockerId: null,
			weight: 30,
			size: RentSize.XL,
			status: RentStatus.CREATED,
		},
	];

	const mockBloqs = [
		{
			id: '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510',
			title: 'Bluberry Regent Street',
			address: '121 Regent St, Mayfair, London W1B 4TB, United Kingdom',
		},
	];

	beforeEach(() => {
		jest.spyOn(SecretsRepository.prototype, 'getSecrets').mockResolvedValueOnce(mockSecrets);
		jest.spyOn(LockerRepository.prototype, 'getLockers').mockResolvedValueOnce(mockLockers);
		jest.spyOn(RentRepository.prototype, 'getRents').mockResolvedValueOnce(mockRents);
		jest.spyOn(BloqRepository.prototype, 'getBloqs').mockResolvedValueOnce(mockBloqs);
		instance = new LockerService();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should open locker with right password', async () => {
		const result = await instance.openLocker('1b8d1e89-2514-4d91-b813-044bf0ce8d20', '095494');

		expect(result).toHaveProperty('status', LockerStatus.OPEN);
	});

	it('should not open locker with wrong password', async () => {
		const result = instance.openLocker('1b8d1e89-2514-4d91-b813-044bf0ce8d20', '959505');

		expect(result).rejects.toThrow('Wrong secret');
	});

	it('should close a locker', async () => {
		const result = await instance.closeLocker('1b8d1e89-2514-4d91-b813-044bf0ce8d20');

		expect(result).toHaveProperty('status', LockerStatus.CLOSED);
	});

	it('should throw a error when locker doesnt exist', async () => {
		const result = instance.closeLocker('000000000');

		expect(result).rejects.toThrow('Locker doesnt exists');
	});

	it('should get a available locker', async () => {
		const result = await instance.getAvailableLocker('84ba232e-ce23-4d8f-ae26-68616600df48');
		expect(result).toMatch(
			/lockerId: 1b8d1e89-2514-4d91-b813-044bf0ce8d20 - secret: \d{6} - bloq address: 121 Regent St, Mayfair, London W1B 4TB, United Kingdom/,
		);
	});

	it('should throw an error when rent doenst exists', async () => {
		const result = instance.getAvailableLocker('000000000');
		expect(result).rejects.toThrow('Cannot find rent');
	});

	it('should throw an error when rent doenst exists', async () => {
		const result = instance.getAvailableLocker('000000000');
		expect(result).rejects.toThrow('Cannot find rent');
	});
});
