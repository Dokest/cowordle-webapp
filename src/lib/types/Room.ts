import type { GameManager } from '$lib/utils/GameManager';
import type { Player } from './Player';

export class Room {
	constructor(
		private readonly code: string,
		private readonly hostPlayer: Player,
		private readonly localPlayer: Player,
		private readonly connectedPlayers: Player[],
		readonly gameManager: GameManager
	) { }

	getCode(): string {
		return this.code;
	}

	getConnectedPlayers(): Player[] {
		return this.connectedPlayers;
	}

	getLocalPlayer(): Player {
		return this.localPlayer;
	}

	getHostPlayer(): Player {
		return this.hostPlayer;
	}

	isLocalHost(): boolean {
		return this.localPlayer.uuid === this.hostPlayer.uuid;
	}
}
