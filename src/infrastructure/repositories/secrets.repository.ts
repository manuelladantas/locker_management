import { readFile, writeFile } from 'fs/promises';
import { Secret } from '../../domain/secrets/secrets';
import ISecretRepo from '../../domain/secrets/secrets.repo';

export class SecretsRepository implements ISecretRepo {
	constructor() {}

	private readonly filePath = './src/infrastructure/data/secrets.json';

	async getSecrets(): Promise<Secret[]> {
		try {
			const fileContent = await readFile(this.filePath, 'utf-8');

			const data = JSON.parse(fileContent);

			return data as Secret[];
		} catch (error) {
			console.log(error);
			throw error;
		}
	}

	async getSecret(lockerId: string, password: string): Promise<Secret | undefined> {
		try {
			const secrets = await this.getSecrets();
			const item = secrets.find((secret) => secret.password === password && secret.lockerId === lockerId);
			return item;
		} catch (error) {
			console.error('Error finding secret by ID:', error);
			throw error;
		}
	}

	async createSecret(newSecret: Secret): Promise<Secret> {
		try {
			const data = await this.getSecrets();
			data.push(newSecret);
			await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
			return newSecret;
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}
