<script lang="ts">
	import { gameManager } from '$lib/stores/gameManagerStore';
	import type { WordlePoints } from '$lib/types/WordlePoints';
	import Word from '../prefrabs/Word.svelte';

	export let wordLength: number;
	export let showOnlyColors: boolean;

	export let tries: string[];

	let boardResults: WordlePoints[][] = [];

	$gameManager.when('onLocalWordResult', (result) => {
		boardResults = [...boardResults, result];
	});
</script>

<div class="mt-5 flex flex-col items-center gap-2">
	{#each tries as playerTry, index}
		<Word
			length={wordLength}
			word={playerTry}
			{showOnlyColors}
			results={boardResults[index]}
			{index}
		/>
	{/each}
</div>
