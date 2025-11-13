import { Secret } from './secrets';

export default interface ISecretRepo {
	getSecretById(id: string): Promise<Secret | undefined>;
	createSecret(newSecret: Secret): Promise<Secret>;
	getSecrets(): Promise<Secret[]>;
}
