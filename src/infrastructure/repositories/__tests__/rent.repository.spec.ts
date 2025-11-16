import { RentSize, RentStatus } from '../../../domain/rent/rent';
import IRentRepo from '../../../domain/rent/rent.repo';
import { RentRepository } from '../rent.repository';
import * as fs from 'fs/promises';

jest.mock('fs/promises', () => ({
	writeFile: jest.fn(),
}));

describe('rentRepository', () => {
	let instance: IRentRepo;

	const mockRents = [
		{
			id: '613c1876-d132-448a-8bac-b589c54d1b3e',
			lockerId: 'e74d04e1-4197-4cb9-a073-4db7224887ee',
			weight: 10,
			size: RentSize.XL,
			status: RentStatus.WAITING_DROPOFF,
		},
		{
			id: 'f82785a9-1208-4ef4-80ab-2dc287a34e11',
			lockerId: 'e74d04e1-4197-4cb9-a073-4db7224887ee',
			weight: 30,
			size: RentSize.XL,
			status: RentStatus.DELIVERED,
		},
	];

	beforeEach(() => {
		instance = new RentRepository();
		jest.spyOn(instance, 'getRents').mockResolvedValueOnce(mockRents);

		(fs.writeFile as jest.Mock).mockResolvedValue(undefined);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('getRentById: should return the rent when ID exists', async () => {
		const result = await instance.getRentById('f82785a9-1208-4ef4-80ab-2dc287a34e11');

		expect(result).toEqual(mockRents[1]);
	});

	it('getRentById: should return undefined when ID does not exists', async () => {
		const result = await instance.getRentById('34934993');

		expect(result).toBeUndefined();
	});

	it('updateById: should update rent by id', async () => {
		await instance.updateById('f82785a9-1208-4ef4-80ab-2dc287a34e11', {
			status: RentStatus.WAITING_PICKUP,
		});

		expect(fs.writeFile).toHaveBeenCalled();
	});

	it('updateById: should not update rent by id when id doesnt exist', async () => {
		const result = instance.updateById('9482394823', {
			status: RentStatus.WAITING_PICKUP,
		});

		expect(result).rejects.toThrow('This rent doesnt exist');
	});

	it('createRent: should create a rent', async () => {
		await instance.createRent({
			id: '513bc20e-41a8-4175-8001-e5f99fd9652c',
			lockerId: '1b8d1e89-2514-4d91-b813-044bf0ce8d20',
			weight: 10,
			size: RentSize.XL,
			status: RentStatus.CREATED,
		});

		expect(fs.writeFile).toHaveBeenCalled();
	});
});
