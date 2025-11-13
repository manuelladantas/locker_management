enum LockerStatus {
	OPEN,
	CLOSED,
}

export type Locker = {
	id: String;
	bloqId: String;
	status: LockerStatus;
	isOccupied: boolean;
	maxWeight: number;
};
