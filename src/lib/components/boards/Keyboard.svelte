<script lang="ts">
	import { gameManager } from '$lib/stores/gameManagerStore';
	import BackspaceSvg from '$lib/svgs/BackspaceSvg.svelte';
	import CheckSvg from '$lib/svgs/CheckSvg.svelte';
	import { WordlePoints } from '$lib/types/WordlePoints';
	import type { InputManager } from '$lib/utils/InputManager';
	import { onMount } from 'svelte';

	export let usedLetters: Record<string, { validity: WordlePoints }> = {};

	let keyboardKeys = [
		['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
		['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
		['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACK'],
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

	let inputsManager: InputManager;

	onMount(() => {
		if (!$gameManager) {
			return;
		}

		inputsManager = $gameManager.localController.getInputManager();

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
		<div class="flex justify-center items-center gap-1 md:gap-2 text-neutral-200">
			{#each row as letter}
				{#if letter === 'BACK'}
					<button
						on:click={() => inputsManager.simulateBackspace()}
						class="w-[3.25rem] h-[32px] py-1 flex justify-center items-center bg-neutral-900 border border-neutral-500 rounded-lg"
					>
						<BackspaceSvg />
					</button>
				{:else if letter === 'ENTER'}
					<button
						on:click={() => inputsManager.simulateEnterPress()}
						class="w-[3.25rem] h-[32px] py-1 flex justify-center items-center bg-neutral-900 border border-neutral-500 rounded-lg"
					>
						<CheckSvg />
					</button>
				{:else}
					<button
						on:click={() => inputsManager.simulateLetterPress(letter)}
						class="w-8 py-1 flex justify-center items-center bg-neutral-900 border border-neutral-500 rounded-lg font-semibold uppercase text-center {getLetterStyles(
							letter
						)}"
						data-testid={`letter_${letter}`}
					>
						<span>{letter}</span>
					</button>
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style>
	.letter-missing {
		@apply bg-neutral-900 text-neutral-500 border-0;
	}

	.letter-in-word {
		@apply bg-yellow-700 border-yellow-900;
	}

	.letter-perfect {
		@apply bg-green-700 border-green-900;
	}
</style>
