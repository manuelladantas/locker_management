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
		const rents = await this.getRents();
		const item = rents.find((rent) => rent.id === id);
		return item;
	}

	async updateById(id: string, updatedData: Partial<Rent>): Promise<Rent> {
		const data = await this.getRents();

		const index = data.findIndex((item) => item.id === id);
		if (index === -1) {
			throw new Error('This rent doesnt exist');
		}

		const updatedItem = { ...data[index], ...updatedData };

		data[index] = updatedItem;

		await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');

		return updatedItem;
	}

	async createRent(rent: Rent): Promise<Rent> {
		const data = await this.getRents();
		data.push(rent);
		await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
		return rent;
	}
}
