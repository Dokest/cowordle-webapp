import { goto } from '$app/navigation';
import type { InitialPlayerInfoDto } from '$lib/dtos/PlayerDto';
import type { LocalController, WordListData } from '$lib/types/LocalController';
import type { Player } from '$lib/types/Player';
import type { Uuid } from '$lib/types/Uuid';
import { WordlePoints } from '$lib/types/WordlePoints';
import { EN_WORDS } from '$lib/words/en_words';
import { ES_WORDS_COMPLETE_LIST } from '$lib/words/es_word_list';
import { ES_WORDS } from '$lib/words/es_words';
import type { RoomState, WebsocketConnection } from '$lib/ws/websockets';
import { Emitter } from './Emitter';
import { GameNotifies } from './GameNotifies';


export class GameManager {
	private readonly notifies: GameNotifies = new GameNotifies();

	private players: Player[] = [];

	private hostPlayer: Player = {} as Player;

	private localPlayer: Player = {} as Player;

	private isLocalPlayerSendingWord = false;


	constructor(readonly roomCode: string, readonly localController: LocalController, private readonly socket: WebsocketConnection, playerName: string) {
		this.localPlayer.name = playerName;
	}


	disconnect(): void {
		this.socket.disconnect();
	}


	async connectToRoom(): Promise<{ roomState: RoomState; localPlayer: Player }> {
		this.bindSocketEvents();

		const { localPlayer, players, hostPlayer, roomState } = await this.socket.dialogue('setup', {
			playerName: this.localPlayer.name,
			roomCode: this.roomCode,
			lastPlayerUuid: localStorage.getItem('lastPlayerUuid'),
		});

		players.forEach((player) => {
			console.log('1', player);

			this.addPlayer(player);
		});

		this.hostPlayer = this.players.find((player) => player.uuid === hostPlayer.uuid)!;
		this.localPlayer = this.players.find((player) => player.uuid === localPlayer.uuid)!;

		this.notifies.playersUpdated.broadcast(this.players);

		this.prepareSendingWords();

		// Do not allow Socket.IO to close the connection
		const repeatPing = () => {
			this.socket.ping();

			setTimeout(repeatPing, 30000);
		};

		repeatPing();

		return {
			roomState,
			localPlayer: this.localPlayer
		};
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


	startGame(wordListId: string): void {
		this.socket.emit('start_game', {
			wordListId,
		});
	}


	prepareSendingWords(): void {
		this.localController.onSendWord.listen(async ([word]) => {
			this.isLocalPlayerSendingWord = true;

			this.localController.toggleInputs(false);

			const result = await this.socket.dialogue('validate_word', {
				word,
				playerUuid: this.localPlayer.uuid,
				roomCode: this.roomCode,
			}).catch((): false => {
				console.error('Error trying to validate word.');

				this.localController.toggleInputs(true);
				this.isLocalPlayerSendingWord = false;

				return false;
			});

			if (!result) {
				return;
			}

			this.isLocalPlayerSendingWord = false;

			[...result.result].forEach((letterResult, index) => {
				if (letterResult === WordlePoints.Exact) {
					this.localController.addKnownLetter(word[index], index);
				}
			});

			this.notifies.onLocalWordResult.broadcast(result.result, word);

			this.localController.toggleInputs(true);
		});
	}


	private addPlayer(player: InitialPlayerInfoDto): void {
		console.log(player);

		const newPlayer: Player = {
			name: player.name,
			uuid: player.uuid as Uuid,
			connectionTimestamp: player.connectionTimestamp,
			tries: [],
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

		localStorage.setItem('playerName', newPlayerName);
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
		console.log('Binding GameManager events');

		this.socket.on('player_connected', ({ newPlayer }) => {
			console.log(2, newPlayer);

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
				if (reason === 'removed') {
					goto('/removed');
				}

				return;
			}

			this.players = this.players.filter((player) => player.uuid !== playerUuid);

			this.notifies.playersUpdated.broadcast(this.players);
		});

		this.socket.on('player_word', ({ playerUuid, result }) => {
			console.log(`Player ${playerUuid} got [${result.join(', ')}]`);

			const player = this.players.find((player) => player.uuid === playerUuid);

			if (!player) {
				console.error("INVALID PLAYER");
				return;
			}

			player.tries = [...player.tries, result];

			this.notifies.onPlayerWord.broadcast(player, result);
		});

		this.socket.on('player_win', ({ playerUuid, solution }) => {
			console.log(`Player ${playerUuid} WON`);

			if (playerUuid === null) {
				this.notifies.onMatchLost.broadcast(solution);
			} else {
				const isLocalWinner = this.localPlayer.uuid === playerUuid;

				const winnerPlayer = this.players.find((player) => player.uuid === playerUuid);

				if (!winnerPlayer) {
					console.error('No winner player found (?)');
					return;
				}

				this.notifies.onPlayerWin.broadcast(isLocalWinner, winnerPlayer.name, solution);
			}

		});

		this.socket.on('start_prematch', ({ startTime, wordListId }) => {
			let words: WordListData = {
				selectableWords: EN_WORDS,
				validWords: EN_WORDS,
			};

			switch (wordListId) {
				case "es_words":
					words = { selectableWords: ES_WORDS, validWords: ES_WORDS_COMPLETE_LIST };
					break;
				default:
					break;
			}

			console.log('Using ', wordListId);

			this.localController.setWordList(words);

			this.players.forEach(player => player.tries = []);

			if (startTime === null) {
				startTime = Date.now();
			}

			this.notifies.gameStarts.broadcast(this.players, startTime);
		});

		this.socket.on('change_host', ({ hostUuid }) => {
			this.hostPlayer = this.getPlayers().find((player) => player.uuid === hostUuid)!;

			this.notifies.onHostChange.broadcast(this.hostPlayer);
		});

		this.socket.on('disconnect', (reason: string) => {
			this.notifies.disconnected.broadcast(reason || 'unknown');
		});

		this.socket.getSocketIo().on('reconnect', (args) => {
			console.log('Reconnect', args);

			if (this.isLocalPlayerSendingWord) {
				console.log('Reconnect: Toggling inputs back on!');

				this.localController.toggleInputs(true);
			}

			this.notifies.reconnect.broadcast();
		});
	}


	closeGame(): void {
		this.clearOldMatch();

		//this.socket.disconnect();
	}


	clearOldMatch(): void {
		//this.localController.unbindAllEvents();
		this.localController.clearOldData();
		this.notifies.unbindAll();
	}
}
