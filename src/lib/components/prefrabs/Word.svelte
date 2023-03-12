<script lang="ts">
	import { gameManager } from '$lib/stores/gameManagerStore';
	import type { WordlePoints } from '$lib/types/WordlePoints';
	import Letter from './Letter.svelte';

	export let word: string | null;
	export let length: number;
	export let showOnlyColors: boolean;
	export let results: WordlePoints[];
	export let index: number = -1;

	let letters: (string | null)[] = [];
	let wordDiv: HTMLElement;

	if (word) {
		letters = Array.from({ length: word.length }, () => null);
	}

	$: {
		if (word) {
			letters = letters.map((letter, index) => {
				return word![index] || null;
			});
		} else {
			letters = Array.from({ length }, () => null);
		}
	}

	if ($gameManager?.localController && index !== -1) {
		const lc = $gameManager.localController;
		lc.onFailWord.listen((wordIndex) => {
			if (index === wordIndex && !wordDiv.classList.contains('show-error')) {
				console.log('FIAL');
				wordDiv.classList.add('show-error');

				setTimeout(() => {
					wordDiv.classList.remove('show-error');
				}, 200);
			}
		});
	}
</script>

<div
	bind:this={wordDiv}
	class="w-fit flex gap-x-1 group cursor-pointer select-none transition-shadow duration-300"
>
	{#each letters as letter, index}
		<Letter
			char={showOnlyColors ? '' : letter}
			result={results ? results[index] : null}
			class="group-hover:border-orange-500"
		/>
	{/each}
</div>

<style global>
	.show-error {
		@apply shadow-lg shadow-red-800;
	}
</style>
