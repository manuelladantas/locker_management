import IBloqRepo from '../../domain/bloq/bloq.repo';
import { LockerStatus } from '../../domain/locker/locker';
import ILockerRepo from '../../domain/locker/locker.repo';
import { RentSize, RentStatus } from '../../domain/rent/rent';
import IRentRepo from '../../domain/rent/rent.repo';
import { SecretStatus } from '../../domain/secrets/secrets';
import ISecretRepo from '../../domain/secrets/secrets.repo';
import { ILockerService, LockerService } from '../locker.service';

jest.mock('fs/promises', () => ({
	writeFile: jest.fn(),
	readFile: jest.fn(),
}));
describe('lockerService', () => {
	let instance: ILockerService;
	let mockBloqRepo: jest.Mocked<IBloqRepo>;
	let mockSecretRepo: jest.Mocked<ISecretRepo>;
	let mockLockRepo: jest.Mocked<ILockerRepo>;
	let mockRentRepo: jest.Mocked<IRentRepo>;

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
		{
			id: 'db7b5a0d-0073-4f05-8458-c7cdb93b1a3a',
			lockerId: '2bda9153-e22e-4c80-8817-f4a5dab8a542',
			status: SecretStatus.DISABLED,
			password: '998877',
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
		{
			id: '2bda9153-e22e-4c80-8817-f4a5dab8a542',
			bloqId: '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510',
			status: LockerStatus.CLOSED,
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
		{
			id: 'ea5c5086-ca10-4920-90da-3367b1261885',
			lockerId: null,
			weight: 90,
			size: RentSize.XL,
			status: RentStatus.CREATED,
		},
		{
			id: '4b7de03b-ef1b-429a-b317-a0994f88386a',
			lockerId: '2bda9153-e22e-4c80-8817-f4a5dab8a542',
			weight: 10,
			size: RentSize.S,
			status: RentStatus.WAITING_PICKUP,
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
		mockBloqRepo = {
			getBloqs: jest.fn().mockResolvedValue(mockBloqs),
			getBloqById: jest.fn(),
		} as jest.Mocked<IBloqRepo>;

		mockSecretRepo = {
			getSecrets: jest.fn().mockResolvedValue(mockSecrets),
			createSecret: jest.fn(),
			getSecret: jest.fn(),
			updateById: jest.fn(),
			getActiveSecret: jest.fn(),
		} as jest.Mocked<ISecretRepo>;

		mockLockRepo = {
			getLockers: jest.fn().mockResolvedValue(mockLockers),
			getLockerById: jest.fn(),
			getMatchedLocker: jest.fn(),
			updateById: jest.fn(),
		} as jest.Mocked<ILockerRepo>;

		mockRentRepo = {
			getRents: jest.fn().mockResolvedValue(mockRents),
			getRentById: jest.fn(),
			createRent: jest.fn(),
			updateById: jest.fn(),
		} as jest.Mocked<IRentRepo>;

		instance = new LockerService(mockSecretRepo, mockBloqRepo, mockLockRepo, mockRentRepo);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('openLocker: should open locker with right password', async () => {
		mockSecretRepo.getSecret.mockResolvedValueOnce(mockSecrets[1]);
		await instance.openLocker('1b8d1e89-2514-4d91-b813-044bf0ce8d20', '095494');

		expect(mockLockRepo.updateById).toHaveBeenCalledWith('1b8d1e89-2514-4d91-b813-044bf0ce8d20', {
			status: LockerStatus.OPEN,
		});
	});

	it('openLocker: should not open locker with wrong password', async () => {
		mockSecretRepo.getSecret.mockResolvedValueOnce(undefined);
		const result = instance.openLocker('1b8d1e89-2514-4d91-b813-044bf0ce8d20', '959505');

		expect(result).rejects.toThrow('Wrong secret');
	});

	it('closeLocker: should close a locker', async () => {
		await instance.closeLocker('1b8d1e89-2514-4d91-b813-044bf0ce8d20');

		expect(mockLockRepo.updateById).toHaveBeenCalledWith('1b8d1e89-2514-4d91-b813-044bf0ce8d20', {
			status: LockerStatus.CLOSED,
		});
	});

	it('getAvailableLocker: should get a available locker', async () => {
		mockRentRepo.getRentById.mockResolvedValueOnce(mockRents[0]);
		mockLockRepo.getMatchedLocker.mockResolvedValueOnce(mockLockers[0]);
		mockBloqRepo.getBloqById.mockResolvedValueOnce(mockBloqs[0]);

		const result = await instance.getAvailableLocker('84ba232e-ce23-4d8f-ae26-68616600df48');

		expect(mockSecretRepo.createSecret).toHaveBeenCalled();
		expect(mockRentRepo.updateById).toHaveBeenCalledWith('84ba232e-ce23-4d8f-ae26-68616600df48', {
			status: RentStatus.WAITING_DROPOFF,
		});
		expect(result).toMatch(
			/lockerId: 1b8d1e89-2514-4d91-b813-044bf0ce8d20 - secret: \d{6} - bloq address: 121 Regent St, Mayfair, London W1B 4TB, United Kingdom/,
		);
	});

	it('getAvailableLocker: should throw an error when rent doenst exists', async () => {
		const result = instance.getAvailableLocker('000000000');
		expect(result).rejects.toThrow('Cannot find rent');
	});

	it('pickupRent: should return an error when pass a rent without a locker associated', async () => {
		mockRentRepo.updateById.mockResolvedValueOnce(mockRents[0]);
		const result = instance.pickUpRent('feb72a9a-258d-49c9-92de-f90b1f11984d');
		expect(result).rejects.toThrow('This rent doesnt have a locker associated');
	});

	it('pickupRent: should pickup rent without errors', async () => {
		mockRentRepo.updateById.mockResolvedValueOnce(mockRents[3]);
		mockSecretRepo.getActiveSecret.mockResolvedValueOnce(mockSecrets[2]);
		await instance.pickUpRent('4b7de03b-ef1b-429a-b317-a0994f88386a');

		expect(mockLockRepo.updateById).toHaveBeenCalledWith('2bda9153-e22e-4c80-8817-f4a5dab8a542', {
			isOccupied: false,
		});

		expect(mockSecretRepo.updateById).toHaveBeenCalledWith('db7b5a0d-0073-4f05-8458-c7cdb93b1a3a', {
			status: SecretStatus.DISABLED,
		});
	});

	it('setRentToLocker: should update rent and locker', async () => {
		instance.setRentToLocker('4b7de03b-ef1b-429a-b317-a0994f88386a', '2bda9153-e22e-4c80-8817-f4a5dab8a542');

		expect(mockLockRepo.updateById).toHaveBeenCalledTimes(1);
		expect(mockRentRepo.updateById).toHaveBeenCalledTimes(1);
	});
});
