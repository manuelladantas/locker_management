import { Locker } from './locker';

export default interface ILockerRepo {
	getLockers(): Promise<Locker[]>;
	getLockerById(id: string): Promise<Locker | undefined>;
	getMatchedLocker(rentWeight: number): Promise<Locker | undefined>;
}
