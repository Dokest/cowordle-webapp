<script lang="ts">
	export let usedLetters: { letter: string; validity: 'invalid' | 'in-word' | 'perfect' }[] = [
		{ letter: 'a', validity: 'in-word' },
	];

	const keyboardKeys = [
		['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
		['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
		['z', 'x', 'c', 'v', 'b', 'n', 'm'],
	];

	function getLetterStyles(letter: string): string {
		const used = usedLetters.find((char) => char.letter === letter);

		if (!used) {
			return '';
		}

		return `letter-${used.validity}`;
	}
</script>

<div class="flex flex-col items-center gap-2">
	{#each keyboardKeys as row}
		<div class="flex gap-2">
			{#each row as letter}
				<p
					class="w-8 py-1 bg-neutral-600 rounded-lg font-semibold uppercase text-center {getLetterStyles(
						letter
					)}"
				>
					{letter}
				</p>
			{/each}
		</div>
	{/each}
</div>

<style>
	.letter-invalid {
		@apply bg-neutral-900;
	}

	.letter-in-word {
		@apply bg-yellow-700;
	}

	.letter-perfect {
		@apply bg-green-700;
	}
</style>
