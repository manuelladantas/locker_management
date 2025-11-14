import { Secret } from './secrets';

export default interface ISecretRepo {
	getSecret(lockerId: string, secret: string): Promise<Secret | undefined>;
	createSecret(newSecret: Secret): Promise<Secret>;
	getSecrets(): Promise<Secret[]>;
}
