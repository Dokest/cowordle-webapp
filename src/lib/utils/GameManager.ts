import { goto } from '$app/navigation';
import type { InitialPlayerInfoDto } from '$lib/dtos/PlayerDto';
import type { LocalController } from '$lib/types/LocalController';
import type { Player } from '$lib/types/Player';
import type { Uuid } from '$lib/types/Uuid';
import type { WebsocketConnection } from '$lib/ws/websockets';
import type { Emitter } from './Emitter';
import { GameNotifies } from './GameNotifies';

export class GameManager<Initialized = true> {
	private readonly notifies: GameNotifies = new GameNotifies();

	private players: Player[] = [];

	private hostPlayer: Player = {} as Player;

	private localPlayer: Player = {} as Player;

	constructor(readonly roomCode: string, readonly localController: LocalController, private readonly socket: WebsocketConnection, playerName: string) {
		this.localPlayer.name = playerName;
	}

	async connectToRoom(): Promise<void> {
		this.bindSocketEvents();

		const { localPlayer, players, hostPlayer } = await this.socket.dialogue('setup', {
			playerName: this.localPlayer.name,
			roomCode: this.roomCode,
		});

		players.forEach((player) => {
			this.addPlayer(player);
		});

		this.hostPlayer = this.players.find((player) => player.uuid === hostPlayer.uuid)!;
		this.localPlayer = this.players.find((player) => player.uuid === localPlayer.uuid)!;

		this.notifies.playersUpdated.broadcast(this.players);
	}

	isLocalHost(): boolean {
		return this.hostPlayer === this.localPlayer;
	}

	isLocalPlayer(player: Player): boolean {
		return this.localPlayer === player;
	}

	isPlayerHost(player: Player): boolean {
		return this.hostPlayer === player;
	}

	getPlayers(): Player[] {
		return [...this.players];
	}

	when<TNotify extends keyof GameNotifies>(
		event: TNotify,
		then: GameNotifies[TNotify] extends Emitter<infer TFn> ? TFn : never
	): void {
		this.notifies[event].listen(then);
	}

	private addPlayer(player: InitialPlayerInfoDto): void {
		const newPlayer: Player = {
			name: player.name,
			uuid: player.uuid as Uuid,
			connectionTimestamp: player.connectionTimestamp,
		};

		const playerExists = this.players.find((existingPlayer) => existingPlayer.uuid === player.uuid);

		if (!playerExists) {
			this.players.push(newPlayer);

			this.players = this.players.sort((firstPlayer, otherPlayer) => {
				if (firstPlayer.connectionTimestamp === otherPlayer.connectionTimestamp) {
					return 0;
				}

				return firstPlayer.connectionTimestamp < otherPlayer.connectionTimestamp ? -1 : 1;
			});

			this.notifies.playerConnects.broadcast(newPlayer);
		}
	}

	renameLocalPlayer(newPlayerName: string): void {
		const uuid = this.localPlayer.uuid;

		if (uuid === null) {
			console.error(`Can't update local player name as uuid is invalid (?)`);
			return;
		}

		this.socket.emit('update_player_name', { newPlayerName, roomCode: this.roomCode, uuid });
	}

	removePlayer(player: Player): void {
		this.socket.emit('remove_player', {
			targetPlayerUuid: player.uuid,
			roomCode: this.roomCode,
			requestingPlayerUuid: this.localPlayer.uuid,
		});
	}

	getLocalPlayer(): Player {
		return this.localPlayer;
	}

	private bindSocketEvents(): void {
		this.socket.on('player_connected', ({ newPlayer }) => {
			this.addPlayer(newPlayer);

			this.notifies.playersUpdated.broadcast(this.players);
		});

		this.socket.on('update_player_name', ({ playerUuid, newPlayerName }) => {
			const player = this.players.find((player) => player.uuid === playerUuid);

			if (!player) {
				return;
			}

			player.name = newPlayerName;

			this.notifies.playerNameIsUpdated.broadcast(player);
		});

		this.socket.on('player_disconnected', ({ playerUuid, reason }) => {
			if (this.localPlayer.uuid === playerUuid) {
				return goto('/removed');
			}

			this.players = this.players.filter((player) => player.uuid !== playerUuid);

			this.notifies.playersUpdated.broadcast(this.players);
		});
	}
}
