<script lang="ts">
	import { gameManager } from '$lib/stores/gameManagerStore';
	import type { WordlePoints } from '$lib/types/WordlePoints';
	import Word from '../prefrabs/Word.svelte';

	// export let currentWord: string = '';
	// export let previousWords: string[] = [];
	export let wordLength: number;
	export let showOnlyColors: boolean;

	export let tries: string[];

	let results: WordlePoints[][] = [];

	$gameManager.when('onLocalWordResult', (result) => {
		results = [...results, result];
	});
</script>

<div class="mt-5 flex flex-col items-center gap-2">
	{#each tries as playerTry, index}
		<Word
			length={wordLength}
			word={playerTry}
			{showOnlyColors}
			bind:results={results[index]}
			{index}
		/>
	{/each}
</div>
