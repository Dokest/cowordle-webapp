import { WebsocketConnection } from '$lib/ws/websockets';
import { writable } from 'svelte/store';


function handleConnection() {
	return new WebsocketConnection();
}

function createWebSocketStore() {
	console.log('CREATING SOCKET');

	// const socket = handleConnection();

	const { subscribe, update } = writable<WebsocketConnection>(undefined);

	return {
		subscribe,
		init: () => {
			update((socket) => {
				// if (socket) {
				// 	socket.disconnect();
				// }
				console.log('> Creating new socket');


				return handleConnection();
			});
		},
	};
}

export let ws = createWebSocketStore();
