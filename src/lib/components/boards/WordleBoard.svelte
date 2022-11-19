<script lang="ts">
	import Word from '../prefrabs/Word.svelte';

	// export let currentWord: string = '';
	// export let previousWords: string[] = [];
	export let wordLength: number;
	export let showOnlyColors: boolean;

	export let tries: (string | null)[];
</script>

<div class="mt-5 flex flex-col items-center gap-2">
	{#each tries as playerTry}
		<Word length={wordLength} word={playerTry} {showOnlyColors} />
	{/each}
</div>
