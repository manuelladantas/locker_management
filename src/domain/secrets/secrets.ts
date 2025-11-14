export enum SecretStatus {
	ENABLE,
	DISABLED,
}

export type Secret = {
	id?: String;
	lockerId: String;
	status: SecretStatus;
	password: String;
};
