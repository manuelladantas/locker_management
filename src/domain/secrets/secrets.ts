export enum SecretStatus {
	ENABLE,
	DISABLED,
}

export type Secret = {
	id?: string;
	lockerId: string;
	status: SecretStatus;
	password: string;
};
