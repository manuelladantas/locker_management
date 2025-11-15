import { Locker } from './locker';

export default interface ILockerRepo {
	getLockers(): Promise<Locker[]>;
	getLockerById(id: string): Promise<Locker | undefined>;
	getMatchedLocker(rentWeight: number): Promise<Locker>;
	updateById(id: string, updatedData: Partial<Locker>): Promise<Locker>;
}
