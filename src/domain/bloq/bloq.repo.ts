import { Bloq } from './bloq';

export default interface IBloqRepo {
	getBloqs(): Promise<Bloq[]>;
	getBloqById(id: string): Promise<Bloq | undefined>;
}
