<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Keyboard from '$lib/components/boards/Keyboard.svelte';
	import WordleBoard from '$lib/components/boards/WordleBoard.svelte';
	import LoadingParty from '$lib/components/prefrabs/LoadingParty.svelte';
	import PostMatch from '$lib/components/text/PostMatch.svelte';
	import { gameManager } from '$lib/stores/gameManagerStore';
	import { ws } from '$lib/stores/websocketStore';
	import { LocalController } from '$lib/types/LocalController';
	import { GameManager } from '$lib/utils/GameManager';
	import { InputManager } from '$lib/utils/InputManager';
	import { generateRandomName } from '$lib/utils/randomString';
	import { onMount } from 'svelte';
	import Lobby from './lobby.svelte';

	const roomCode: string = $page.params['roomCode'];

	let roomState: 'loading' | 'lobby' | 'in-game' | 'post-match' = 'loading';

	if (!roomCode) {
		goto('/error?e=missing-roomcode');
	}

	const MAX_TRIES = 6;

	let tries: string[] = [];
	tries.length = MAX_TRIES;
	tries = tries.fill('', 0, MAX_TRIES);

	let winnerData = {
		isLocalPlayer: false,
		name: '',
		solution: '',
	};

	let lobby: Lobby;

	onMount(() => {
		const localPlayer = new LocalController(new InputManager(), MAX_TRIES, 5);

		const randomPlayerName = generateRandomName();
		gameManager.set(new GameManager(roomCode, localPlayer, $ws, randomPlayerName));

		$gameManager.connectToRoom().then(() => {
			roomState = 'lobby';
		});

		prepareGame();
	});

	function prepareGame(): void {
		$gameManager.when('gameStarts', (_, startTimeMs) => {
			lobby?.startCountdown(startTimeMs);

			setTimeout(() => {
				$gameManager.getLocalController().clearInputs();
				$gameManager.getLocalController().toggleInputs(true);

				roomState = 'in-game';
			}, startTimeMs - Date.now());
		});

		$gameManager.getLocalController().onChangeTries.listen((playerTries) => {
			tries = playerTries;
		});

		$gameManager.when('onPlayerWin', (localPlayerWinner, winnerName, solution) => {
			$gameManager.getLocalController().toggleInputs(false);

			winnerData.isLocalPlayer = localPlayerWinner;
			winnerData.name = winnerName;
			winnerData.solution = solution;

			roomState = 'post-match';
		});
	}

	function rematch(): void {
		$gameManager.clearOldMatch();
		prepareGame();

		roomState = 'lobby';
	}

	function backToMainMenu(): void {
		$gameManager.closeGame();

		goto('/');
	}
</script>

<div class="mt-5 w-[90%] md:w-[50%] mx-auto">
	{#if roomState === 'loading'}
		<LoadingParty />
	{:else if roomState === 'lobby'}
		<Lobby bind:this={lobby} />
	{:else if roomState === 'in-game'}
		<div class="w-full md:w-96 mx-auto">
			<WordleBoard {tries} wordLength={5} showOnlyColors={false} />

			<div class="my-5">
				<Keyboard />
			</div>
		</div>
	{:else if roomState === 'post-match'}
		<PostMatch
			isLocalWinner={winnerData.isLocalPlayer}
			winnerName={winnerData.name}
			solution={winnerData.solution}
			on:rematch={rematch}
			on:goToMainMenu={backToMainMenu}
		/>
	{/if}
</div>
