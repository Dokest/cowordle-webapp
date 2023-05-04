import { WebsocketConnection } from '$lib/ws/websockets';
import { writable } from 'svelte/store';


function handleConnection() {
	return new WebsocketConnection();
}

function createWebSocketStore() {
	console.log('CREATING SOCKET');

	const socket = handleConnection();

	const { subscribe } = writable(socket);

	return {
		subscribe,
		restart: () => {
			ws = createWebSocketStore()
		},
	};
}

export let ws = createWebSocketStore();
