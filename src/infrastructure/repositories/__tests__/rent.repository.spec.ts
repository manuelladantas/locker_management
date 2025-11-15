import { RentSize, RentStatus } from '../../../domain/rent/rent';
import IRentRepo from '../../../domain/rent/rent.repo';
import { RentRepository } from '../rent.repository';

describe('rentRepository', () => {
	let instance: IRentRepo;

	const mockRents = [
		{
			id: '84ba232e-ce23-4d8f-ae26-68616600df48',
			lockerId: '6b33b2d1-af38-4b60-a3c5-53a69f70a351',
			weight: 10,
			size: RentSize.XL,
			status: RentStatus.WAITING_DROPOFF,
		},
		{
			id: 'feb72a9a-258d-49c9-92de-f90b1f11984d',
			lockerId: '6b33b2d1-af38-4b60-a3c5-53a69f70a351',
			weight: 30,
			size: RentSize.XL,
			status: RentStatus.DELIVERED,
		},
	];

	beforeEach(() => {
		instance = new RentRepository();
		jest.spyOn(instance, 'getRents').mockResolvedValueOnce(mockRents);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return the rent when ID exists', async () => {
		const result = await instance.getRentById('feb72a9a-258d-49c9-92de-f90b1f11984d');

		expect(result).toEqual(mockRents[1]);
	});

	it('should return undefined when ID does not exists', async () => {
		const result = await instance.getRentById('34934993');

		expect(result).toBeUndefined();
	});

	it('should update rent by id', async () => {
		await instance.updateById('feb72a9a-258d-49c9-92de-f90b1f11984d', {
			status: RentStatus.WAITING_PICKUP,
		});

		const result = await instance.getRentById('feb72a9a-258d-49c9-92de-f90b1f11984d');

		expect(result).toHaveProperty('status', RentStatus.WAITING_PICKUP);
	});

	it('should not update rent by id when id doesnt exist', async () => {
		const result = instance.updateById('9482394823', {
			status: RentStatus.WAITING_PICKUP,
		});

		expect(result).rejects.toThrow('This rent doesnt exist');
	});

	it('should create a rent', async () => {
		await instance.createRent({
			id: '513bc20e-41a8-4175-8001-e5f99fd9652c',
			lockerId: '1b8d1e89-2514-4d91-b813-044bf0ce8d20',
			weight: 10,
			size: RentSize.XL,
			status: RentStatus.CREATED,
		});

		expect(mockRents).toHaveLength(3);
	});
});
