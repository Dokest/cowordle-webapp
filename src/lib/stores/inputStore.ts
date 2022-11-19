import { InputManager } from '$lib/utils/InputManager';
import { readable } from 'svelte/store';

function createInputManagerStore() {
	const { subscribe } = readable(new InputManager());

	return {
		subscribe,
	};
}

export const input = createInputManagerStore();
