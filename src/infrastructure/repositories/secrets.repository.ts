import { readFile, writeFile } from 'fs/promises';
import { Secret, SecretStatus } from '../../domain/secrets/secrets';
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

	async updateById(id: string, updatedData: Partial<Secret>): Promise<Secret> {
		const data = await this.getSecrets();

		const index = data.findIndex((item) => item.id === id);
		if (index === -1) {
			throw new Error('This secret doesnt exist');
		}

		const updatedItem = { ...data[index], ...updatedData };

		data[index] = updatedItem;

		await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');

		return updatedItem;
	}

	async getActiveSecret(lockerId: string): Promise<Secret> {
		const secrets = await this.getSecrets();
		const item = secrets.find((secret) => secret.lockerId === lockerId && secret.status === SecretStatus.ENABLE);

		if (!item) {
			throw new Error('Cannot find a active secret to this locker');
		}
		return item;
	}

	async getSecret(lockerId: string, password: string): Promise<Secret | undefined> {
		const secrets = await this.getSecrets();
		const item = secrets.find((secret) => secret.password === password && secret.lockerId === lockerId);
		return item;
	}

	async createSecret(newSecret: Secret): Promise<Secret> {
		const data = await this.getSecrets();
		data.push(newSecret);
		await writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
		return newSecret;
	}
}
