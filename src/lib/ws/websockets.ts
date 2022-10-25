import ioClient, { Socket } from "socket.io-client";
import { readable } from 'svelte/store';

/*
export const wsSocket = ioClient('http://localhost:9000', {
	autoConnect: true,
	withCredentials: true,
});
*/

let websocketConnection: Socket;

export const ws = readable<() => Socket>(() => websocketConnection, function start(set) {
	console.log('Preparing connection...');

	websocketConnection = ioClient('http://localhost:9000', {
		autoConnect: true,
		withCredentials: true,
	});

	return function stop() {
		websocketConnection.disconnect();
	};
});
