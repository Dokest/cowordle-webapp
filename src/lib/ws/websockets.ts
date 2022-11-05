import { PUBLIC_WEBSOCKET_URL } from '$env/static/public';
import type { Player } from '$lib/types/Player';
import ioClient, { Socket } from 'socket.io-client';

export type WebSocketDialogueEvent = {
	ping: () => void;
	message: (message: string) => string;
	setup: (args: { roomCode: string; playerName: string }) => boolean;
};

export type WebsocketInEvent = {
	initial_room_info: {
		players: Player[];
		host: Player;
	};
	initial_local_info: {
		uuid: string,
	};
	player_connected: {
		player: string;
	};
	player_disconnected: {
		player: string;
	};
	update_player_name: {
		playerUuid: string;
		newPlayerName: string;
	}
};

export type WebsocketOutEvent = {
	setup: {
		roomCode: string;
		playerName: string;
	};
	update_player_name: {
		uuid: string;
		roomCode: string;
		newPlayerName: string;
	};
};

export type EventName<T> = keyof T;

export class WebsocketConnection {
	private readonly socket: Socket;

	private pingCallbacks: (() => void)[] = [];

	constructor() {
		this.socket = ioClient(PUBLIC_WEBSOCKET_URL, {
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
		this.socket.disconnect();
	}

	private bindEvents(): void {
		this.socket.on('ping', () => this.pingCallbacks.forEach((callback) => callback()));
	}
}
