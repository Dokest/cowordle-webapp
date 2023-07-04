<script lang="ts">
	import { gameManager } from '$lib/stores/gameManagerStore';
	import HomeSvg from '$lib/svgs/HomeSvg.svelte';
	import RefreshSvg from '$lib/svgs/RefreshSvg.svelte';
	import { WordlePoints } from '$lib/types/WordlePoints';
	import { createEventDispatcher, onMount } from 'svelte';
	import Word from '../prefrabs/Word.svelte';

	export let isLocalWinner: boolean;
	export let winnerName: string;
	export let solution: string;
	export let isLost: boolean;
	export let accumulatedKnowledge: WordlePoints[];

	const events = createEventDispatcher();

	onMount(() => {
		if (!$gameManager) {
			return;
		}

		const letters = $gameManager.getLocalController().getKnownLettersFormatted();

		accumulatedKnowledge = [...letters].map((letter) => {
			return letter === '?' ? WordlePoints.Missing : WordlePoints.Exact;
		});

		if (isLocalWinner) {
			accumulatedKnowledge = accumulatedKnowledge.map(() => WordlePoints.Exact);
		}
	});

	function rematch(): void {
		events('rematch');
	}

	function goToMainMenu(): void {
		events('goToMainMenu');
	}
</script>

<div class="flex flex-col justify-center items-center gap-2 text-xl">
	{#if isLost}
		<p>Everyone <span class="text-2xl font-semibold text-red-500">LOST</span></p>
	{:else}
		<p>{isLocalWinner ? 'You' : winnerName}</p>
		<p class="fancy-text text-2xl">WON</p>
	{/if}

	<div class="flex flex-col items-center gap-2 m-4">
		<p>The solution was</p>
		<Word word={solution} length={6} results={accumulatedKnowledge} showOnlyColors={false} />
	</div>
</div>

<div class="my-10 flex flex-col justify-center items-center gap-y-5">
	<button
		title="Rematch"
		on:click={rematch}
		class="flex items-center gap-x-2 p-2 border rounded-lg bg-neutral-900"
	>
		<RefreshSvg class="w-10" />
	</button>
	<button
		title="Exit to the main menu"
		on:click={goToMainMenu}
		class="p-2 border rounded-lg bg-neutral-900"
	>
		<HomeSvg />
	</button>
</div>

<style global>
	.fancy-text {
		@apply font-extrabold;

		animation: background-pan 3s linear infinite;
		background: linear-gradient(to right, #15803d, #4ade80, #22c55e, #15803d);

		background-clip: text;
		background-size: 200%;
		-webkit-text-fill-color: transparent;
		white-space: nowrap;
	}

	@keyframes background-pan {
		from {
			background-position: 0% center;
		}

		to {
			background-position: -200% center;
		}
	}
</style>
