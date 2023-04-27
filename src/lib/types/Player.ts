import type { Uuid } from './Uuid';

export interface Player {
	uuid: Uuid;
	name: string;
	connectionTimestamp: number;
}
