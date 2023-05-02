import type { Uuid } from './Uuid';
import type { WordlePoints } from './WordlePoints';

export interface Player {
	uuid: Uuid;
	name: string;
	connectionTimestamp: number;
	tries: WordlePoints[][];
}
