<script lang="ts">
	import { gameManager } from '$lib/stores/gameManagerStore';
	import { room } from '$lib/stores/roomStore';
	import CheckSvg from '$lib/svgs/CheckSvg.svelte';
	import CrownSvg from '$lib/svgs/CrownSvg.svelte';
	import EditSvg from '$lib/svgs/EditSvg.svelte';
	import type { Player } from '$lib/types/Player';

	let localPlayerName = $gameManager.getLocalPlayer().name;
	let isEditingName: boolean = false;
	let nameInput: HTMLInputElement;

	$gameManager.when('playersUpdated', (updatedPlayers) => {
		players = updatedPlayers;
	});

	$gameManager.when('playerNameIsUpdated', () => {
		players = $gameManager.getPlayers();
	});

	const isAuth = $gameManager.isLocalHost();

	let players: Player[] = [];

	players = $gameManager.getPlayers();

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

	function startGame(): void {
		//
	}
</script>

<div>
	<div class="flex flex-col md:flex-row md:justify-center md:flex-wrap gap-2">
		{#each players as player (player.uuid)}
			{@const isLocal = $gameManager.isLocalPlayer(player)}
			{@const isPlayerAuth = $gameManager.isPlayerHost(player)}

			<div class="flex items-center gap-3">
				<div
					class="relative w-[90%] md:w-64 px-3 py-2 flex flex-[7] items-center gap-x-1 bg-neutral-600 rounded-lg
							{isLocal ? 'ring-1 ring-orange-500' : ''}"
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
							class="w-full bg-transparent focus:outline-none
								{isEditingName ? 'border-b' : ''}"
						/>

						<!-- Options -->
						<div
							class="w-[10%] h-full px-2 flex-1 flex items-center md:w-8 hover:text-neutral-300"
						>
							{#if isLocal}
								<button on:click={() => toggleNameEditing()} class="">
									{#if isEditingName}
										<CheckSvg />
									{:else}
										<EditSvg />
									{/if}
								</button>
							{/if}
						</div>
					{:else if isAuth || true}
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

<button
	disabled={!$room || !$room.isLocalHost()}
	on:click={() => startGame()}
	class="mx-auto my-5 px-3 py-2 rounded-lg border disabled:bg-neutral-200 disabled:text-neutral-800 font-semibold disabled:cursor-not-allowed cursor-pointer"
>
	START
</button>
