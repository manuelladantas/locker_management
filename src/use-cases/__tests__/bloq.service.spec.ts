import { BloqRepository } from '../../infrastructure/repositories/bloq.repository';
import { BloqService, IBloqService } from '../bloq.service';

describe('bloqService', () => {
	let instance: IBloqService;

	const mockBloqs = [
		{
			id: '22ffa3c5-3a3d-4f71-81f1-cac18ffbc510',
			title: 'Bluberry Regent Street',
			address: '121 Regent St, Mayfair, London W1B 4TB, United Kingdom',
		},
	];

	beforeEach(() => {
		jest.spyOn(BloqRepository.prototype, 'getBloqs').mockResolvedValueOnce(mockBloqs);
		instance = new BloqService();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should get bloqs', async () => {
		const bloqs = await instance.getAllBloqs();

		expect(bloqs).toHaveLength(1);
		expect(bloqs[0]).toHaveProperty('title', 'Bluberry Regent Street');
	});
});
