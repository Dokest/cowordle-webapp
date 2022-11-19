<script lang="ts">
	import Letter from './Letter.svelte';

	export let word: string | null;
	export let length: number;
	export let showOnlyColors: boolean;

	let letters: (string | null)[] = [];

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

	function setText(): void {
		if (word) {
			letters = letters.map((letter, index) => {
				return word![index] || null;
			});
		} else {
			letters = Array.from({ length }, () => null);
		}
	}
</script>

<div class="w-fit flex gap-x-1 group cursor-pointer select-none">
	{#each letters as letter}
		<Letter char={showOnlyColors ? null : letter} class="group-hover:border-orange-500" />
	{/each}
</div>
