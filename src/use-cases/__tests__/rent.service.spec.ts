import { Rent, RentSize } from '../../domain/rent/rent';
import { RentRepository } from '../../infrastructure/repositories/rent.repository';
import { IRentService, RentService } from '../rent.service';
import * as fs from 'fs/promises';

jest.mock('fs/promises', () => ({
	writeFile: jest.fn(),
}));
describe('rentService', () => {
	let instance: IRentService;

	const mockRents: Rent[] = [];

	beforeEach(() => {
		jest.spyOn(RentRepository.prototype, 'getRents').mockResolvedValueOnce(mockRents);
		instance = new RentService();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('create new Rent', async () => {
		await instance.createRent(10, RentSize.S);
		expect(fs.writeFile).toHaveBeenCalled();
	});
});
