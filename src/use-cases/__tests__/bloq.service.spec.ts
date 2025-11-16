import { BloqRepository } from '../../infrastructure/repositories/bloq.repository';
import { BloqService, IBloqService } from '../bloq.service';

describe('bloqService', () => {
	let instance: IBloqService;

	const mockBloqs = [
		{
			id: '4592a6f2-a81e-4f80-b7b5-caf17ec4c5a2',
			title: 'Test street',
			address: 'Test street address',
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
		expect(bloqs[0]).toHaveProperty('title', 'Test street');
	});
});
