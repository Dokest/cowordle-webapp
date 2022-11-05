import type { Room } from '$lib/types/Room';
import { writable } from 'svelte/store';


function createRoom() {
	const { subscribe, set } = writable<Room>();

	return {
		subscribe,
		init: (newRoom: Room) => set(newRoom),
	};
};

export const room = createRoom();
