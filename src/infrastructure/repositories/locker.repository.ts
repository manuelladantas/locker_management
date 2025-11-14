import { readFile, writeFile } from 'fs/promises';
import ILockerRepo from '../../domain/locker/locker.repo';
import { Locker } from '../../domain/locker/locker';

export class LockerRepository implements ILockerRepo {
	constructor() {}

	private readonly filePath = './src/infrastructure/data/lockers.json';

	async getLockers(): Promise<Locker[]> {
		try {
			const fileContent = await readFile(this.filePath, 'utf-8');

			const data = JSON.parse(fileContent);

			return data as Locker[];
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async getLockerById(id: string): Promise<Locker | undefined> {
		try {
			const lockers = await this.getLockers();
			const item = lockers.find((locker) => locker.id === id);
			return item;
		} catch (error) {
			console.error('Error finding locker by ID:', error);
			throw error;
		}
	}

	async getMatchedLocker(rentWeight: number): Promise<Locker | undefined> {
		try {
			const lockers = await this.getLockers();
			const item = lockers.find((locker) => locker.maxWeight >= rentWeight && locker.isOccupied === false);
			return item;
		} catch (error) {
			console.error('Error finding locker by ID:', error);
			throw error;
		}
	}

	async updateById(id: string, updatedData: Partial<Locker>): Promise<void> {
		const data = await this.getLockers();

		const index = data.findIndex((item) => item.id === id);
		if (index === -1) return;

		const updatedItem = { ...data[index], ...updatedData };

		data[index] = updatedItem;

		await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
	}
}
