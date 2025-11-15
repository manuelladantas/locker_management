import { LockerStatus } from '../../../domain/locker/locker';
import ILockerRepo from '../../../domain/locker/locker.repo';
import { LockerRepository } from '../locker.repository';

describe('lockerRepository', () => {
	let instance: ILockerRepo;

	const mockLockers = [
		{
			id: '1b8d1e89-2514-4d91-b813-044bf0ce8d20',
			bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
			status: LockerStatus.CLOSED,
			isOccupied: false,
			maxWeight: 50,
		},
		{
			id: '8b4b59ae-8de5-4322-a426-79c29315a9f1',
			bloqId: 'c3ee858c-f3d8-45a3-803d-e080649bbb6f',
			status: LockerStatus.CLOSED,
			isOccupied: true,
			maxWeight: 20,
		},
	];

	beforeEach(() => {
		instance = new LockerRepository();
		jest.spyOn(instance, 'getLockers').mockResolvedValueOnce(mockLockers);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return the locker when ID exists', async () => {
		const result = await instance.getLockerById('8b4b59ae-8de5-4322-a426-79c29315a9f1');

		expect(result).toEqual(mockLockers[1]);
	});

	it('should return undefined when ID does not exists', async () => {
		const result = await instance.getLockerById('32984932849328');

		expect(result).toBeUndefined();
	});

	it('should update locker by id', async () => {
		await instance.updateById('8b4b59ae-8de5-4322-a426-79c29315a9f1', {
			status: LockerStatus.OPEN,
		});

		const result = await instance.getLockerById('8b4b59ae-8de5-4322-a426-79c29315a9f1');

		expect(result).toHaveProperty('status', LockerStatus.OPEN);
	});

	it('should not update locker by id when id doesnt exist', async () => {
		const result = instance.updateById('9482394823', {
			status: LockerStatus.OPEN,
		});

		expect(result).rejects.toThrow('Locker doesnt exists');
	});

	it('should get a matched lock to rent', async () => {
		const result = await instance.getMatchedLocker(40);

		expect(result).toEqual(mockLockers[0]);
	});

	it('should not match lock to rent', async () => {
		const result = instance.getMatchedLocker(60);

		expect(result).rejects.toThrow('Cannot find a locker to this rent');
	});
});
