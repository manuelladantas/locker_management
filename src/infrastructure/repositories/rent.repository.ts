import { readFile, writeFile } from 'fs/promises';
import IRentRepo from '../../domain/rent/rent.repo';
import { Rent } from '../../domain/rent/rent';

export class RentRepository implements IRentRepo {
	constructor() {}

	private readonly filePath = './src/infrastructure/data/rents.json';

	async getRents(): Promise<Rent[]> {
		try {
			const fileContent = await readFile(this.filePath, 'utf-8');

			const data = JSON.parse(fileContent);

			return data as Rent[];
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async getRentById(id: string): Promise<Rent | undefined> {
		try {
			const rents = await this.getRents();
			const item = rents.find((rent) => rent.id === id);
			return item;
		} catch (error) {
			console.error('Error finding rent by ID:', error);
			throw error;
		}
	}

	async updateById(id: string, updatedData: Partial<Rent>): Promise<Rent | undefined> {
		const data = await this.getRents();

		const index = data.findIndex((item) => item.id === id);
		if (index === -1) return;

		const updatedItem = { ...data[index], ...updatedData };

		data[index] = updatedItem;

		await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');

		return updatedItem;
	}

	async createRent(rent: Rent): Promise<Rent> {
		try {
			const data = await this.getRents();
			data.push(rent);
			await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
			return rent;
		} catch (error) {
			throw error;
		}
	}
}
