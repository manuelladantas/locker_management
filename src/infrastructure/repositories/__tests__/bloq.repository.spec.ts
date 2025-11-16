import IBloqRepo from '../../../domain/bloq/bloq.repo';
import { BloqRepository } from '../bloq.repository';

describe('bloqRepository', () => {
	let instance: IBloqRepo;
	let mockGetBloqs: jest.SpyInstance;

	const mockBloqs = [
		{
			id: '1ebb59be-51cb-4f55-b780-6dfb22197b80',
			title: 'Test street 1',
			address: 'Address test street',
		},
		{
			id: 'f3547d1b-6051-45b5-9cb8-616f549a1104',
			title: 'Test street 2',
			address: 'Address test street street',
		},
	];

	beforeEach(() => {
		instance = new BloqRepository();
		mockGetBloqs = jest.spyOn(instance, 'getBloqs').mockResolvedValueOnce(mockBloqs);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('getBloqById: should return the bloq when ID exists', async () => {
		const result = await instance.getBloqById('1ebb59be-51cb-4f55-b780-6dfb22197b80');

		expect(result).toEqual(mockBloqs[0]);
		expect(mockGetBloqs).toHaveBeenCalledTimes(1);
	});

	it('getBloqById: should return undefined when ID does not exist', async () => {
		const result = await instance.getBloqById('1234355');

		expect(result).toBeUndefined();
	});

	it('should call getBloqs method', async () => {
		await instance.getBloqById('1ebb59be-51cb-4f55-b780-6dfb22197b80');

		expect(mockGetBloqs).toHaveBeenCalled();
	});
});
