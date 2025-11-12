import { Bloq } from './bloq';

export default interface IBloqRepo {
	getBloqs(): Promise<Bloq[]>;
}
