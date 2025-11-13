enum SecretStatus {
	ENABLE,
	DISABLED,
}

export type Secret = {
	id: String;
	bloqId: String;
	status: SecretStatus;
	password: String;
};
