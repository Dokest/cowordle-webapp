import type { Player } from '$lib/types/Player';
import { Emitter } from './Emitter';

export class GameNotifies {
	playerConnects: Emitter<(player: Player) => void> = new Emitter();
	playerNameIsUpdated: Emitter<(player: Player) => void> = new Emitter();
	playersUpdated: Emitter<(players: Player[]) => void> = new Emitter();
}
