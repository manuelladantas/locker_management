export enum SecretStatus {
	ENABLE = 'ENABLE',
	DISABLED = 'DISABLED',
}

export type Secret = {
	id: string;
	lockerId: string;
	status: SecretStatus;
	password: string;
};
