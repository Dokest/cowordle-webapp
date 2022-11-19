<script lang="ts">
	import Word from '../prefrabs/Word.svelte';

	// export let currentWord: string = '';
	// export let previousWords: string[] = [];
	export let wordLength: number;
	export let showOnlyColors: boolean;

	export let tries: (string | null)[];

	// let currentTry = 0;

	// onMount(() => {
	// 	const body = document.getElementsByTagName('body')[0];

	// 	body.addEventListener('keypress', (event) => {
	// 		if (event.code === 'Enter') {
	// 			return;
	// 		}

	// 		const currentWord = tries[currentTry];

	// 		if (currentWord === null) {
	// 			tries[currentTry] = event.key;
	// 		} else {
	// 			if (currentWord.length === WORD_LENGTH) {
	// 				return;
	// 			}

	// 			tries[currentTry] += event.key;
	// 		}

	// 		tries = tries;
	// 	});

	// 	body.addEventListener('keydown', (event) => {
	// 		if (event.code === 'Backspace') {
	// 			const currentWord = tries[currentTry];

	// 			if (currentWord === null) {
	// 				return;
	// 			}

	// 			tries[currentTry] = currentWord.substring(0, currentWord.length - 1);

	// 			tries = tries;
	// 		}
	// 	});
	// });
</script>

<div class="mt-5 flex flex-col items-center gap-2">
	{#each tries as playerTry}
		<Word length={wordLength} word={playerTry} {showOnlyColors} />
	{/each}
</div>
