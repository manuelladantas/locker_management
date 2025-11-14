export enum RentStatus {
	CREATED,
	WAITING_DROPOFF,
	WAITING_PICKUP,
	DELIVERED,
}

export enum RentSize {
	XS,
	S,
	M,
	L,
	XL,
}

export type Rent = {
	id: string;
	lockerId: string | null;
	weight: number;
	size: RentSize;
	status: RentStatus;
};
