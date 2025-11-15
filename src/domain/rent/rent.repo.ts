import { Rent } from './rent';

export default interface IRentRepo {
	getRents(): Promise<Rent[]>;
	getRentById(id: string): Promise<Rent | undefined>;
	updateById(id: string, updatedData: Partial<Rent>): Promise<Rent>;
	createRent(Rent: Rent): Promise<Rent>;
}
