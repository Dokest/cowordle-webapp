import { goto } from '$app/navigation';
import type { InitialPlayerInfoDto } from '$lib/dtos/PlayerDto';
import type { LocalController } from '$lib/types/LocalController';
import type { Player } from '$lib/types/Player';
import type { Uuid } from '$lib/types/Uuid';
import type { WebsocketConnection } from '$lib/ws/websockets';
import { Emitter } from './Emitter';
import { GameNotifies } from './GameNotifies';


export class GameManager {
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

		this.prepareSendingWords();
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
		const notify = this.notifies[event];

		if (notify instanceof Emitter) {
			notify.listen(then);
		}
	}

	startGame(): void {
		this.socket.emit('start_game', {
			playerUuid: this.localPlayer.uuid,
			roomCode: this.roomCode,
		});
	}

	prepareSendingWords(): void {
		this.localController.onSendWord.listen(async ([word]) => {
			this.localController.toggleInputs(false);

			const result = await this.socket.dialogue('validate_word', {
				word,
				playerUuid: this.localPlayer.uuid,
				roomCode: this.roomCode,
			});

			this.notifies.onLocalWordResult.broadcast(result.result, word);

			this.localController.toggleInputs(true);
		});
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

	getLocalController(): LocalController {
		return this.localController;
	}

	private bindSocketEvents(): void {
		console.log('BINDING EVENTS');

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

		this.socket.on('on_start_game', () => {
			console.log('ON START GAME');

			this.notifies.gameStarts.broadcast(this.players);
		});

		this.socket.on('player_word', ({ playerUuid, result }) => {
			console.log(`Player ${playerUuid} got [${result.join(', ')}]`);
		});

		this.socket.on('player_win', ({ playerUuid, solution }) => {
			console.log(`Player ${playerUuid} WON`);

			const isLocalWinner = this.localPlayer.uuid === playerUuid;

			const winnerPlayer = this.players.find((player) => player.uuid === playerUuid);

			if (!winnerPlayer) {
				console.error('No winner player found (?)');
				return;
			}

			this.notifies.onPlayerWin.broadcast(isLocalWinner, winnerPlayer.name, solution);
		});
	}


	closeGame(): void {
		this.clearOldMatch();

		this.socket.disconnect();
	}


	clearOldMatch(): void {
		//this.localController.unbindAllEvents();
		this.localController.clearOldData();
		this.notifies.unbindAll();
	}
}
