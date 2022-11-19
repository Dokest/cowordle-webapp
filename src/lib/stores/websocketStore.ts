import { WebsocketConnection } from '$lib/ws/websockets';
import { writable } from 'svelte/store';


function handleConnection() {
	return new WebsocketConnection();
}

function createWebSocketStore() {
	const socket = handleConnection();

	const { subscribe } = writable(socket);

	return {
		subscribe,
	};
}

export const ws = createWebSocketStore();
