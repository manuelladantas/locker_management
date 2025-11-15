import IBloqRepo from '../../../domain/bloq/bloq.repo';
import { BloqRepository } from '../bloq.repository';

describe('bloqRepository', () => {
	let instance: IBloqRepo;
	let mockGetBloqs: jest.SpyInstance;

	const mockBloqs = [
		{
			id: '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510',
			title: 'Bluberry Regent Street',
			address: '121 Regent St, Mayfair, London W1B 4TB, United Kingdom',
		},
		{
			id: '484e01be-1570-4ac1-a2a9-02aad3acc54e',
			title: 'Riod Eixample',
			address: "Pg. de Gràcia, 74, L'Eixample, 08008 Barcelona, Spain",
		},
	];

	beforeEach(() => {
		instance = new BloqRepository();
		mockGetBloqs = jest.spyOn(instance, 'getBloqs').mockResolvedValueOnce(mockBloqs);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return the bloq when ID exists', async () => {
		const result = await instance.getBloqById('22ffa3c5-3a3d-4f71-81f1-cac18ffbc510');

		expect(result).toEqual(mockBloqs[0]);
		expect(mockGetBloqs).toHaveBeenCalledTimes(1);
	});

	it('should return undefined when ID does not exist', async () => {
		const result = await instance.getBloqById('1234355');

		expect(result).toBeUndefined();
	});

	it('should call getBloqs method', async () => {
		await instance.getBloqById('22ffa3c5-3a3d-4f71-81f1-cac18ffbc510');

		expect(mockGetBloqs).toHaveBeenCalled();
	});
});
