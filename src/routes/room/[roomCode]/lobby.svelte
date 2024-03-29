<script lang="ts">
	import { goto } from '$app/navigation';
	import { gameManager } from '$lib/stores/gameManagerStore';
	import CheckSvg from '$lib/svgs/CheckSvg.svelte';
	import CrownSvg from '$lib/svgs/CrownSvg.svelte';
	import EditSvg from '$lib/svgs/EditSvg.svelte';
	import HomeSvg from '$lib/svgs/HomeSvg.svelte';
	import PlaySvg from '$lib/svgs/PlaySvg.svelte';
	import ShareSvg from '$lib/svgs/ShareSvg.svelte';
	import type { Player } from '$lib/types/Player';
	import { QRCodeImage } from 'svelte-qrcode-image';

	export let gameHasAlreadyStarted: boolean;

	let localPlayerName = $gameManager.getLocalPlayer().name;
	let isEditingName: boolean = false;
	let nameInput: HTMLInputElement;
	let roomCodeCopied = false;
	let countdown: number | null = null;
	let wordListId: string = 'es_words';
	let showQrCode = false;
	let qrSize = 200;

	$gameManager.when('playersUpdated', (updatedPlayers) => {
		players = updatedPlayers;
	});

	$gameManager.when('playerNameIsUpdated', () => {
		players = $gameManager.getPlayers();
	});

	$gameManager.when('onHostChange', (host) => {
		isAuth = $gameManager.isLocalHost();
		players = players;
	});

	let isAuth = $gameManager.isLocalHost();

	let players: Player[] = [];

	players = $gameManager.getPlayers();

	export function startCountdown(startAt: number): void {
		const totalTime = startAt - Date.now();
		const topTime = totalTime % 1000;
		countdown = (totalTime - topTime) / 1000 + 1;

		const countdownFn = () => {
			countdown! -= 1;
			console.log(countdown);

			if (countdown! <= 0) {
				countdown = null;
			} else {
				setTimeout(countdownFn, 1000);
			}
		};

		setTimeout(countdownFn, topTime);

		// for (let i = fullSeconds; i >= 0; --i) {
		// 	const left = i - 1;

		// 	setTimeout(() => {
		// 		const time = fullSeconds - left;
		// 		countdown = time;

		// 		if (countdown === 0) {
		// 			countdown = null;
		// 		}
		// 		console.log(countdown);
		// 	}, left * 1000);
		// }
	}

	function toggleNameEditing(): void {
		isEditingName = !isEditingName;

		if (isEditingName) {
			nameInput.focus();
		} else {
			$gameManager.renameLocalPlayer(localPlayerName);
		}
	}

	function removePlayer(player: Player): void {
		$gameManager.removePlayer(player);
	}

	async function copyRoomCode(): Promise<void> {
		roomCodeCopied = true;
		await navigator.clipboard.writeText(window.location.href);

		setTimeout(() => (roomCodeCopied = false), 2000);
	}

	function startGame(): void {
		$gameManager.startGame(wordListId);
	}

	function exitGame(): void {
		$gameManager.closeGame();
		goto('/');
	}

	function increaseQrSize(extraSize = 50): void {
		qrSize = Math.min(1000, qrSize + extraSize);
	}

	function decreaseQrSize(reduceSize = 50): void {
		qrSize = Math.max(200, qrSize - reduceSize);
	}
</script>

<div>
	<div class="w-[90%] md:w-[40%] mx-auto flex flex-col gap-2">
		<div class="flex flex-col gap-y-2 items-center mb-8 text-center">
			<p class="text-xl">The room code is</p>
			<p class="p-2 font-semibold text-2xl tracking-widest rounded-lg bg-neutral-900">
				{$gameManager.roomCode.toUpperCase()}
			</p>
		</div>

		{#each players as player (player.uuid)}
			{@const isLocal = $gameManager.isLocalPlayer(player)}
			{@const isPlayerAuth = $gameManager.isPlayerHost(player)}

			<div class="flex items-center gap-3 font-semibold">
				<div
					class="relative w-full px-3 py-2 flex items-center gap-x-1 bg-neutral-900 rounded-lg border
							{isLocal ? 'border border-orange-500' : 'border-white'}"
				>
					{#if isPlayerAuth}
						<CrownSvg
							class="absolute -top-3 -left-3 h-6 aspect-square fill-orange-500"
						/>
					{/if}
					{#if isLocal}
						<input
							type="text"
							id="playerName"
							bind:this={nameInput}
							bind:value={localPlayerName}
							disabled={!isEditingName}
							class="w-full bg-transparent focus:outline-none border-b
								{isEditingName ? '' : 'border-b-transparent'}"
						/>

						<!-- Options -->
						<div
							class="w-[10%] h-full px-2 flex-1 flex items-center md:w-8 hover:text-neutral-300"
						>
							{#if isLocal}
								<button
									title="Edit your name"
									on:click={() => toggleNameEditing()}
									class=""
								>
									{#if isEditingName}
										<CheckSvg />
									{:else}
										<EditSvg />
									{/if}
								</button>
							{/if}
						</div>
					{:else if isAuth}
						<p>{player.name}</p>
						<button
							title="Remove player"
							on:click={() => removePlayer(player)}
							class="ml-auto"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
								/>
							</svg>
						</button>
					{:else}
						<p class="w-full">{player.name}</p>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

{#if gameHasAlreadyStarted}
	<div class="flex flex-col items-center">
		<div
			class="w-auto mt-5 px-3 py-2 text-center border border-red-500 rounded-lg font-semibold text-red-500 bg-neutral-900"
		>
			<p>Game is in progress</p>
			<p>Wait for the current match to end</p>
		</div>
	</div>
{/if}

<div class="my-10 flex flex-col items-center justify-center gap-2">
	<button
		title={isAuth ? 'Start the game!' : 'Only the host can start the game'}
		disabled={!isAuth}
		on:click={() => startGame()}
		class="px-7 py-2 rounded-lg font-semibold cursor-pointer disabled:cursor-default border
			{countdown !== null ? 'border-green-500' : ''}
			{countdown === null ? 'disabled:border-neutral-500' : ''}
			{isAuth ? 'bg-neutral-900' : ''}"
	>
		<div class="flex items-center gap-x-1">
			<PlaySvg class="w-10 {countdown === null && !isAuth ? 'text-neutral-500' : ''}" />

			{#if countdown}
				Starting in <span class="font-semibold text-green-500 animate-pulse"
					>{countdown}</span
				> seconds
			{/if}
		</div>
	</button>

	<div class="flex gap-2">
		<button
			title="Copy & share the room link"
			on:click={() => copyRoomCode()}
			class="px-3 py-2 border rounded-lg font-semibold cursor-pointer disabled:cursor-default bg-neutral-900"
		>
			{#if roomCodeCopied}
				<CheckSvg animate={true} />
			{:else}
				<ShareSvg />
			{/if}
		</button>

		<button
			title="Exit the room"
			class="px-3 py-2 border rounded-lg bg-neutral-900"
			on:click={exitGame}
		>
			<HomeSvg />
		</button>
	</div>

	<div class="my-14 w-[90%] flex flex-col items-center gap-y-2">
		{#if isAuth}
			<h2 class="mx-auto font-semibold">SETTINGS</h2>
			<div class="w-full flex justify-around items-center">
				<p>Word list</p>
				<select
					bind:value={wordListId}
					class="px-2 py-1 border border-neutral-200 bg-transparent font-semibold rounded-lg focus:rounded-b-none transition-[border-radius]"
				>
					<option value="es_words" class="text-black font-semibold">Español</option>
					<option value="en_words" class="text-black font-semibold">English</option>
				</select>
			</div>
		{/if}

		<button
			class="px-2 py-1 mt-2 border border-neutral-200 bg-transparent font-semibold rounded-lg"
			on:click={() => (showQrCode = !showQrCode)}
		>
			{!showQrCode ? 'Show' : 'Hide'} QR Code
		</button>

		<div class={showQrCode ? '' : 'hidden'}>
			<div class="flex justify-center gap-5 text-3xl">
				<button on:click={() => increaseQrSize()}>+</button>
				<button on:click={() => decreaseQrSize()}>-</button>
			</div>
			<QRCodeImage text={location.href} displayWidth={qrSize} displayClass="rounded-lg" />
		</div>
	</div>

	<!-- <div class="flex gap-2">
		<p>Share the room code</p>
		<button on:click={() => copyRoomCode()}>
			{#if roomCodeCopied}
				<CheckSvg animate={true} />
			{:else}
				<CopySvg />
			{/if}
		</button>
	</div> -->
</div>
