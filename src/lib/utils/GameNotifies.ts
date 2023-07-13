import type { Player } from '$lib/types/Player';
import type { WordlePoints } from '$lib/types/WordlePoints';
import { Emitter } from './Emitter';

export class GameNotifies {
	playerConnects: Emitter<(player: Player) => void> = new Emitter();
	playerNameIsUpdated: Emitter<(player: Player) => void> = new Emitter();
	playersUpdated: Emitter<(players: Player[]) => void> = new Emitter();
	gameStarts: Emitter<(players: Player[], startTimeMs: number) => void> = new Emitter();
	onLocalWordResult: Emitter<(result: WordlePoints[], word: string) => void> = new Emitter();
	onPlayerWin: Emitter<(isLocalPlayer: boolean, winnerName: string, solution: string) => void> = new Emitter();
	onPlayerWord: Emitter<(player: Player, result: WordlePoints[]) => void> = new Emitter();
	onMatchLost: Emitter<(solution: string) => void> = new Emitter();
	onHostChange: Emitter<(host: Player) => void> = new Emitter();
	disconnected: Emitter<(reason: string) => void> = new Emitter();
	reconnect: Emitter<() => void> = new Emitter();

	unbindAll(): void {
		Object.values(this).forEach((property) => {
			if (property instanceof Emitter) {
				property.clear();
			}
		});
	}
}
