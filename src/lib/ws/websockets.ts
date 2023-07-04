import { env } from '$env/dynamic/public';
import { PUBLIC_WS_PORT } from '$env/static/public';
import type { InitialPlayerInfoDto } from '$lib/dtos/PlayerDto';
import type { Uuid } from '$lib/types/Uuid';
import type { WordlePoints } from '$lib/types/WordlePoints';
import ioClient, { Socket } from 'socket.io-client';

export type RoomState = 'LOBBY' | 'IN-GAME';


export type WebSocketDialogueEvent = {
	ping: () => void;
	message: (message: string) => string;
	setup: (args: { roomCode: string; playerName: string }) => {
		players: InitialPlayerInfoDto[];
		hostPlayer: InitialPlayerInfoDto;
		localPlayer: InitialPlayerInfoDto;
		roomState: RoomState;
	};
	validate_word: (args: { roomCode: string, playerUuid: string, word: string }) => {
		result: WordlePoints[];
	};
};

export type WebsocketInEvent = {
	initial_room_info: {
		players: InitialPlayerInfoDto[];
		hostPlayer: InitialPlayerInfoDto;
		localPlayer: InitialPlayerInfoDto;
	};
	initial_local_info: {
		uuid: string,
	};

	player_connected: {
		newPlayer: InitialPlayerInfoDto;
	};

	player_disconnected: {
		playerUuid: Uuid;
		reason: string;
	};
	update_player_name: {
		playerUuid: string;
		newPlayerName: string;
	};
	on_start_game: void;
	start_prematch: {
		startTime: number | null;
		wordListId: string;
	};
	player_word: {
		playerUuid: string;
		result: WordlePoints[];
	};
	player_win: {
		playerUuid: string | null;
		solution: string;
	};
};

export type WebsocketOutEvent = {
	setup: {
		roomCode: string;
		playerName: string;
	};
	update_player_name: {
		uuid: Uuid;
		roomCode: string;
		newPlayerName: string;
	};
	remove_player: {
		targetPlayerUuid: Uuid;
		roomCode: string;
		requestingPlayerUuid: Uuid;
	};
	start_game: {
		wordListId: string;
	};
};

export type EventName<T> = keyof T & string;

export class WebsocketConnection {
	private readonly socket: Socket;

	private pingCallbacks: (() => void)[] = [];

	constructor() {
		const domain = env.PUBLIC_WEBSOCKET_URL || 'localhost';

		this.socket = ioClient(`${domain}:${PUBLIC_WS_PORT}`, {
			autoConnect: true,
			withCredentials: true,
		});

		this.bindEvents();
	}

	ping(): Promise<void> {
		return this.dialogue('ping', undefined);
	}

	async dialogue<TEvent extends EventName<WebSocketDialogueEvent>, TEventMethod extends WebSocketDialogueEvent[TEvent]>(
		event: TEvent,
		params: Parameters<TEventMethod>[0],
		eventResponse?: string
	): Promise<ReturnType<WebSocketDialogueEvent[TEvent]>> {
		return new Promise((resolve, reject) => {
			this.socket.emit(event, params);

			this.socket.on<string>(eventResponse || event, (result) => {
				this.socket.off(event);

				resolve(result);
			});

			setTimeout(() => reject('timeout'), 10000);
		});
	}

	emit<TEvent extends EventName<WebsocketOutEvent>, TArgs extends WebsocketOutEvent[TEvent]>(
		event: TEvent,
		args: TArgs,
	): void {
		this.socket.emit(event, args);
	}

	on<TEvent extends EventName<WebsocketInEvent>, TArgs extends WebsocketInEvent[TEvent]>(
		event: TEvent,
		callback: (args: TArgs) => void,
	): void {
		this.socket.on(event as string, callback);
	}

	disconnect() {
		if (!this.socket.disconnected) {
			this.socket.disconnect();
		}
	}

	getWebsocketSocket(): Socket<any, any> {
		return this.socket;
	}

	private bindEvents(): void {
		this.socket.on('ping', () => this.pingCallbacks.forEach((callback) => callback()));
	}
}
