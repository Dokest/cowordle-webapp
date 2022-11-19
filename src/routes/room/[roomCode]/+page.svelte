<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import LoadingParty from '$lib/components/prefrabs/LoadingParty.svelte';
	import { gameManager } from '$lib/stores/gameManagerStore';
	import { ws } from '$lib/stores/websocketStore';
	import { LocalController } from '$lib/types/LocalController';
	import { GameManager } from '$lib/utils/GameManager';
	import { InputManager } from '$lib/utils/InputManager';
	import { generateRandomName } from '$lib/utils/randomString';
	import { onMount } from 'svelte';
	import Lobby from './lobby.svelte';

	const roomCode: string = $page.params['roomCode'];

	let roomState: 'loading' | 'lobby' | 'in-game' = 'loading';

	if (!roomCode) {
		goto('/error?e=missing-roomcode');
	}

	onMount(() => {
		const localPlayer = new LocalController(new InputManager(), 5, 5);

		const randomPlayerName = generateRandomName();
		gameManager.set(new GameManager(roomCode, localPlayer, $ws, randomPlayerName));

		$gameManager.connectToRoom().then(() => {
			roomState = 'lobby';
		});
	});
</script>

<div class="mt-5 w-[90%] md:w-[50%] mx-auto">
	{#if roomState === 'loading'}
		<LoadingParty />
	{:else if roomState === 'lobby'}
		<Lobby />
	{:else if roomState === 'in-game'}
		IN GAME
		<!-- <LocalWordleBoard tries={$room.gameManager.localPlayer} /> -->
	{/if}
</div>
