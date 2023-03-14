<script lang="ts">
	import { gameManager } from '$lib/stores/gameManagerStore';
	import CheckSvg from '$lib/svgs/CheckSvg.svelte';
	import CrownSvg from '$lib/svgs/CrownSvg.svelte';
	import EditSvg from '$lib/svgs/EditSvg.svelte';
	import ExitSvg from '$lib/svgs/ExitSvg.svelte';
	import PlaySvg from '$lib/svgs/PlaySvg.svelte';
	import ShareSvg from '$lib/svgs/ShareSvg.svelte';
	import type { Player } from '$lib/types/Player';

	let localPlayerName = $gameManager.getLocalPlayer().name;
	let isEditingName: boolean = false;
	let nameInput: HTMLInputElement;
	let roomCodeCopied = false;
	let countdown: number | null = null;

	$gameManager.when('playersUpdated', (updatedPlayers) => {
		players = updatedPlayers;
	});

	$gameManager.when('playerNameIsUpdated', () => {
		players = $gameManager.getPlayers();
	});

	const isAuth = $gameManager.isLocalHost();

	let players: Player[] = [];

	players = $gameManager.getPlayers();

	export function startCountdown(startAt: number): void {
		const totalTime = startAt - Date.now();
		const topTime = totalTime % 1000;
		countdown = (totalTime - topTime) / 1000 + 1;

		const countdownFn = () => {
			countdown! -= 1;
			console.log(countdown);

			if (countdown === 0) {
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
		$gameManager.startGame();
	}
</script>

<div>
	<div class="flex flex-col md:flex-row md:justify-center md:flex-wrap gap-2">
		{#each players as player (player.uuid)}
			{@const isLocal = $gameManager.isLocalPlayer(player)}
			{@const isPlayerAuth = $gameManager.isPlayerHost(player)}

			<div class="flex items-center gap-3 font-semibold">
				<div
					class="relative w-[90%] md:w-64 px-3 py-2 flex flex-[7] items-center gap-x-1 bg-neutral-900 rounded-lg border
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
						<p>{player.name}</p>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

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

		<button title="Exit the room" class="px-3 py-2 border rounded-lg bg-neutral-900">
			<ExitSvg />
		</button>
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
