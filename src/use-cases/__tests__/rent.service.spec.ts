import { Rent, RentSize } from '../../domain/rent/rent';
import IRentRepo from '../../domain/rent/rent.repo';
import { IRentService, RentService } from '../rent.service';

jest.mock('fs/promises', () => ({
	writeFile: jest.fn(),
}));
describe('rentService', () => {
	let instance: IRentService;
	let mockRentRepo: jest.Mocked<IRentRepo>;

	const mockRents: Rent[] = [];

	beforeEach(() => {
		mockRentRepo = {
			getRents: jest.fn().mockResolvedValue(mockRents),
			getRentById: jest.fn(),
			createRent: jest.fn(),
			updateById: jest.fn(),
		} as jest.Mocked<IRentRepo>;
		instance = new RentService(mockRentRepo);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('create new Rent', async () => {
		await instance.createRent(10, RentSize.S);
		expect(mockRentRepo.createRent).toHaveBeenCalled();
	});
});
