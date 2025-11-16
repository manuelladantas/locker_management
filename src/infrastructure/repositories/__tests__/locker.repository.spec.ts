import { LockerStatus } from '../../../domain/locker/locker';
import ILockerRepo from '../../../domain/locker/locker.repo';
import { LockerRepository } from '../locker.repository';
import * as fs from 'fs/promises';

jest.mock('fs/promises', () => ({
	writeFile: jest.fn(),
}));
describe('lockerRepository', () => {
	let instance: ILockerRepo;

	const mockLockers = [
		{
			id: 'ea275a78-70c6-4bf3-86bf-3e3c43ff6399',
			bloqId: 'e74d04e1-4197-4cb9-a073-4db7224887ee',
			status: LockerStatus.CLOSED,
			isOccupied: false,
			maxWeight: 50,
		},
		{
			id: '5684fba7-705e-4539-8dd4-672819f5ea75',
			bloqId: 'e74d04e1-4197-4cb9-a073-4db7224887ee',
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

	it('getLockerById: should return the locker when ID exists', async () => {
		const result = await instance.getLockerById('5684fba7-705e-4539-8dd4-672819f5ea75');

		expect(result).toEqual(mockLockers[1]);
	});

	it('getLockerById: should return undefined when ID does not exists', async () => {
		const result = await instance.getLockerById('32984932849328');

		expect(result).toBeUndefined();
	});

	it('updateById: should update locker by id', async () => {
		await instance.updateById('5684fba7-705e-4539-8dd4-672819f5ea75', {
			status: LockerStatus.OPEN,
		});

		expect(fs.writeFile).toHaveBeenCalled();
	});

	it('updateById: should not update locker by id when id doesnt exist', async () => {
		const result = instance.updateById('9482394823', {
			status: LockerStatus.OPEN,
		});

		expect(result).rejects.toThrow('Locker doesnt exists');
	});

	it('getMatchedLocker: should get a matched lock to rent', async () => {
		const result = await instance.getMatchedLocker(40);

		expect(result).toEqual(mockLockers[0]);
	});

	it('getMatchedLocker: should not match lock to rent', async () => {
		const result = instance.getMatchedLocker(60);

		expect(result).rejects.toThrow('Cannot find a locker to this rent');
	});
});
