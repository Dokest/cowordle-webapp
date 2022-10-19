<script lang="ts">
	import Letter from './Letter.svelte';

	export let word: string | null;
	export let length: number;

	let letters: (string | null)[] = [];
	if (word) {
		letters = [...word];
	} else {
		letters = Array.from({ length }, () => null);
	}
</script>

<div class="w-fit flex gap-x-1 group cursor-pointer">
	{#each letters as letter}
		<Letter char={letter} class="group-hover:border-orange-500" />
	{/each}
</div>
