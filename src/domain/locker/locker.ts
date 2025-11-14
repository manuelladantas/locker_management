export enum LockerStatus {
	OPEN,
	CLOSED,
}

export type Locker = {
	id: string;
	bloqId: string;
	status: LockerStatus;
	isOccupied: boolean;
	maxWeight: number;
};
