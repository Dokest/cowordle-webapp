<script lang="ts">
	import RefreshSvg from '$lib/svgs/RefreshSvg.svelte';
	import { createEventDispatcher } from 'svelte';

	export let isLocalWinner: boolean;
	export let winnerName: string;
	export let solution: string;

	const events = createEventDispatcher();

	function rematch(): void {
		events('rematch');
	}

	function goToMainMenu(): void {
		events('goToMainMenu');
	}
</script>

<div class="flex flex-col justify-center items-center text-xl">
	<p>{isLocalWinner ? 'You' : winnerName}</p>
	<p class="fancy-text text-2xl">WON</p>

	<p>The solution was <span class="font-semibold">{solution}</span></p>
</div>

<div class="my-10 flex flex-col md:flex-row justify-center gap-y-5">
	<button on:click={rematch} class="mx-auto flex items-center gap-x-2 p-2 border rounded-lg">
		<RefreshSvg class="w-4 h-4" />
		Rematch
	</button>
	<button on:click={goToMainMenu} class="mx-auto p-2 border rounded-lg">Main menu</button>
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
