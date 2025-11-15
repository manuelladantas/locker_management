import { SecretStatus } from '../../../domain/secrets/secrets';
import ISecretRepo from '../../../domain/secrets/secrets.repo';
import { SecretsRepository } from '../secrets.repository';
import * as fs from 'fs/promises';

jest.mock('fs/promises', () => ({
	writeFile: jest.fn(),
}));
describe('secretRepository', () => {
	let instance: ISecretRepo;

	const mockSecrets = [
		{
			id: 'c1f04109-a9b1-43c4-989f-48c23386ae20',
			lockerId: '8b4b59ae-8de5-4322-a426-79c29315a9f1',
			status: SecretStatus.ENABLE,
			password: '403703',
		},
		{
			id: '466201da-890e-4e47-80a0-61d5ba0d0883',
			lockerId: '8b4b59ae-8de5-4322-a426-79c29315a9f1',
			status: SecretStatus.DISABLED,
			password: '095494',
		},
	];

	beforeEach(() => {
		instance = new SecretsRepository();
		jest.spyOn(instance, 'getSecrets').mockResolvedValueOnce(mockSecrets);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return the secret when exists', async () => {
		const result = await instance.getSecret('8b4b59ae-8de5-4322-a426-79c29315a9f1', '403703');

		expect(result).toEqual(mockSecrets[0]);
	});

	it('should return undefined when the password is wrong', async () => {
		const result = await instance.getSecret('8b4b59ae-8de5-4322-a426-79c29315a9f1', '0000000');

		expect(result).toBeUndefined();
	});

	it('should get the activate secret', async () => {
		const result = await instance.getActiveSecret('8b4b59ae-8de5-4322-a426-79c29315a9f1');

		expect(result).toEqual(mockSecrets[0]);
	});

	it('should update secret by locker id', async () => {
		await instance.updateById('c1f04109-a9b1-43c4-989f-48c23386ae20', {
			status: SecretStatus.DISABLED,
		});

		expect(fs.writeFile).toHaveBeenCalled();
	});

	it('should not update rent by id when id doesnt exist', async () => {
		const result = instance.updateById('0293023902930', {
			status: SecretStatus.DISABLED,
		});

		expect(result).rejects.toThrow('This secret doesnt exist');
	});

	it('should create a secret', async () => {
		await instance.createSecret({
			id: '3e6b86e1-083f-45a4-b5c1-d29fbfb9cd5f',
			lockerId: 'f604f9e2-d413-464b-8766-6b0a8ce0a66c',
			status: SecretStatus.ENABLE,
			password: '080767',
		});

		expect(mockSecrets).toHaveLength(3);
	});
});
