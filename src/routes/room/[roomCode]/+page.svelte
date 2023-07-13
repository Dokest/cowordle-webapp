<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Keyboard from '$lib/components/boards/Keyboard.svelte';
	import WordleBoard from '$lib/components/boards/WordleBoard.svelte';
	import LoadingParty from '$lib/components/prefrabs/LoadingParty.svelte';
	import Word from '$lib/components/prefrabs/Word.svelte';
	import PostMatch from '$lib/components/text/PostMatch.svelte';
	import { gameManager } from '$lib/stores/gameManagerStore';
	import { LocalController } from '$lib/types/LocalController';
	import type { Player } from '$lib/types/Player';
	import { WordlePoints } from '$lib/types/WordlePoints';
	import { GameManager } from '$lib/utils/GameManager';
	import { InputManager } from '$lib/utils/InputManager';
	import { generateRandomName } from '$lib/utils/randomString';
	import { WebsocketConnection } from '$lib/ws/websockets';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import Disconnected from './disconnected.svelte';
	import Lobby from './lobby.svelte';

	const roomCode: string = $page.params['roomCode'];

	let roomState: 'loading' | 'lobby' | 'in-game' | 'post-match' = 'loading';
	let gameHasAlreadyStarted = false;
	let disconnectedReason: string | undefined = undefined;
	let hasDisconnected = false;

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
		isLost: false,
	};

	let lobby: Lobby;

	let players: Player[] = [];

	onMount(() => {
		const localPlayer = new LocalController(new InputManager(), MAX_TRIES, 5);
		const ws = new WebsocketConnection();

		const randomPlayerName = localStorage.getItem('playerName') || generateRandomName();
		gameManager.set(new GameManager(roomCode, localPlayer, ws, randomPlayerName));

		$gameManager.connectToRoom().then(({ roomState: currentRoomState, localPlayer }) => {
			roomState = 'lobby';

			gameHasAlreadyStarted = currentRoomState === 'IN-GAME';

			localStorage.setItem('lastPlayerUuid', localPlayer.uuid);
		});

		prepareGame();

		window.addEventListener('popstate', onCloseGame);
	});

	function onCloseGame(): void {
		window.removeEventListener('popstate', onCloseGame);

		$gameManager.disconnect();
	}

	function prepareGame(): void {
		$gameManager.when('gameStarts', (_, startTimeMs) => {
			players = $gameManager.getPlayers();

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

			winnerData.isLost = false;
			winnerData.name = winnerName;
			winnerData.solution = solution;
			winnerData.isLocalPlayer = localPlayerWinner;

			roomState = 'post-match';
			gameHasAlreadyStarted = false;
		});

		$gameManager.when('onMatchLost', (solution) => {
			$gameManager.getLocalController().toggleInputs(false);

			winnerData.isLost = true;
			winnerData.name = '';
			winnerData.solution = solution;
			winnerData.isLocalPlayer = false;

			roomState = 'post-match';
			gameHasAlreadyStarted = false;
		});

		$gameManager.when('onPlayerWord', (player, result) => {
			players = players.sort((a, b) => {
				const aLastResults = a.tries.at(-1) ?? [];
				const bLastResults = b.tries.at(-1) ?? [];

				const aPoints = aLastResults.reduce((prev, curr) => prev + curr, 0);
				const bPoints = bLastResults.reduce((prev, curr) => prev + curr, 0);

				return aPoints === bPoints ? 0 : aPoints < bPoints ? 1 : -1;
			});
		});

		$gameManager.when('onLocalWordResult', (result) => {
			players = players;
		});

		$gameManager.when('disconnected', (reason) => {
			console.log(`Disconnected [Reason: ${reason}]`);

			disconnectedReason = reason;

			setTimeout(() => {
				if (disconnectedReason) {
					hasDisconnected = true;
				}
			}, 30000);
		});

		$gameManager.when('reconnect', () => {
			disconnectedReason = undefined;
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

	function compareResults(playerResult?: WordlePoints[]): string {
		if (!playerResult) {
			return '?????';
		}

		const knownLetters = $gameManager.getLocalController().getKnownLettersFormatted();

		return playerResult
			.map((res, index) => {
				if (res === WordlePoints.Exact) {
					return knownLetters[index];
				}

				return '?';
			})
			.join('');
	}
</script>

<div class="mt-5 w-[90%] md:w-[50%] mx-auto">
	{#if disconnectedReason && !hasDisconnected}
		<div class="flex flex-col justify-center items-center text-center">
			<div class="px-3 py-2 my-2 rounded-lg border border-red-500 bg-red-600 bg-opacity-20">
				<p>There are some problems with the connection...</p>
				<p>We are trying to reconnect to the match.</p>
			</div>
		</div>
	{/if}

	{#if hasDisconnected}
		<Disconnected reason={disconnectedReason || ''} />
	{:else if roomState === 'loading'}
		<LoadingParty />
	{:else if roomState === 'lobby'}
		<Lobby bind:this={lobby} {gameHasAlreadyStarted} />
	{:else if roomState === 'in-game'}
		<div class="w-full md:w-96 mx-auto">
			<WordleBoard {tries} wordLength={5} showOnlyColors={false} />

			<div class="my-5">
				<Keyboard />
			</div>

			<div class="mx-auto flex flex-col items-center gap-2 scale-90">
				{#if players.length > 1}
					<h2 class="text-lg font-semibold">LEADERBOARD</h2>

					{#each players as player, index (player.uuid)}
						<div animate:flip={{ duration: (d) => 30 * Math.sqrt(d) }}>
							<p class="mb-1 text-sm font-bold">
								{index + 1}. {player.name}
								{$gameManager.isLocalPlayer(player) ? '(You)' : ''}
							</p>
							<Word
								length={5}
								results={player.tries.at(-1) || []}
								showOnlyColors={false}
								index={0}
								word={compareResults(player.tries.at(-1))}
							/>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{:else if roomState === 'post-match'}
		<PostMatch
			isLocalWinner={winnerData.isLocalPlayer}
			winnerName={winnerData.name}
			solution={winnerData.solution}
			isLost={winnerData.isLost}
			accumulatedKnowledge={[]}
			on:rematch={rematch}
			on:goToMainMenu={backToMainMenu}
		/>
	{/if}
</div>
