<script lang="ts">
	import { gameManager } from '$lib/stores/gameManagerStore';
	import { WordlePoints } from '$lib/types/WordlePoints';
	import { onMount } from 'svelte';

	export let usedLetters: Record<string, { validity: WordlePoints }> = {};

	let keyboardKeys = [
		['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
		['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
		['z', 'x', 'c', 'v', 'b', 'n', 'm'],
	];

	const colorCss = {
		[WordlePoints.Exact]: 'letter-perfect',
		[WordlePoints.InWord]: 'letter-in-word',
		[WordlePoints.Missing]: 'letter-missing',
	};

	function getLetterStyles(letter: string): string {
		const used = letter in usedLetters;

		if (!used) {
			return '';
		}

		return colorCss[usedLetters[letter].validity];
	}

	onMount(() => {
		$gameManager.when('onLocalWordResult', (result, word) => {
			[...word].forEach((letter, index) => {
				if (letter in usedLetters) {
					usedLetters[letter] =
						result[index] > usedLetters[letter].validity
							? { validity: result[index] }
							: usedLetters[letter];
				} else {
					usedLetters[letter] = { validity: result[index] };
				}
			});

			keyboardKeys = keyboardKeys;
		});
	});
</script>

<div class="flex flex-col items-center gap-2">
	{#each keyboardKeys as row}
		<div class="flex justify-center items-center gap-1 md:gap-2">
			{#each row as letter}
				<p
					class="w-8 py-1 flex justify-center items-center bg-neutral-600 rounded-lg font-semibold uppercase text-center {getLetterStyles(
						letter
					)}"
				>
					<span>{letter}</span>
				</p>
			{/each}
		</div>
	{/each}
</div>

<style>
	.letter-missing {
		@apply bg-neutral-900 text-neutral-500;
	}

	.letter-in-word {
		@apply bg-yellow-700;
	}

	.letter-perfect {
		@apply bg-green-700;
	}
</style>
