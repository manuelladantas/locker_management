import IBloqRepo from '../../domain/bloq/bloq.repo';
import { BloqService, IBloqService } from '../bloq.service';

describe('bloqService', () => {
	let instance: IBloqService;
	let mockBloqRepo: jest.Mocked<IBloqRepo>;

	const mockBloqs = [
		{
			id: '4592a6f2-a81e-4f80-b7b5-caf17ec4c5a2',
			title: 'Test street',
			address: 'Test street address',
		},
	];

	beforeEach(() => {
		mockBloqRepo = {
			getBloqs: jest.fn().mockResolvedValue(mockBloqs),
			getBloqById: jest.fn(),
		} as jest.Mocked<IBloqRepo>;
		instance = new BloqService(mockBloqRepo);
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
