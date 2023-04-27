import type { GameManager } from '$lib/utils/GameManager';
import { writable } from 'svelte/store';

export const gameManager = writable<GameManager>(undefined);
