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
			id: '396b2b0d-9fe2-4d71-99e9-c28dc44cf25c',
			lockerId: '880bb14c-28ff-492d-abf2-dd85e7b8f7b8',
			status: SecretStatus.ENABLE,
			password: '403703',
		},
		{
			id: 'cc4d2fa6-0747-43f5-880a-1a5ddbfeb582',
			lockerId: '880bb14c-28ff-492d-abf2-dd85e7b8f7b8',
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

	it('getSecrets: hould return the secret when exists', async () => {
		const result = await instance.getSecret('880bb14c-28ff-492d-abf2-dd85e7b8f7b8', '403703');

		expect(result).toEqual(mockSecrets[0]);
	});

	it('getSecret: should return undefined when the password is wrong', async () => {
		const result = await instance.getSecret('880bb14c-28ff-492d-abf2-dd85e7b8f7b8', '0000000');

		expect(result).toBeUndefined();
	});

	it('getActiveSecret: should get the activate secret', async () => {
		const result = await instance.getActiveSecret('880bb14c-28ff-492d-abf2-dd85e7b8f7b8');

		expect(result).toEqual(mockSecrets[0]);
	});

	it('updateById: should update secret by locker id', async () => {
		await instance.updateById('396b2b0d-9fe2-4d71-99e9-c28dc44cf25c', {
			status: SecretStatus.DISABLED,
		});

		expect(fs.writeFile).toHaveBeenCalled();
	});

	it('updateById: should not update rent by id when id doesnt exist', async () => {
		const result = instance.updateById('0293023902930', {
			status: SecretStatus.DISABLED,
		});

		expect(result).rejects.toThrow('This secret doesnt exist');
	});

	it('createSecret: should create a secret', async () => {
		await instance.createSecret({
			id: '3e6b86e1-083f-45a4-b5c1-d29fbfb9cd5f',
			lockerId: 'f604f9e2-d413-464b-8766-6b0a8ce0a66c',
			status: SecretStatus.ENABLE,
			password: '080767',
		});

		expect(mockSecrets).toHaveLength(3);
	});
});
