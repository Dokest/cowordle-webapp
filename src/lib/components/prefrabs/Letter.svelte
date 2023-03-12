<script lang="ts">
	import { WordlePoints } from '$lib/types/WordlePoints';

	export let char: string | null = null;
	let klass: string = '';

	export { klass as class };

	export let result: WordlePoints | null;

	const colors = {
		[WordlePoints.Exact]: 'letter-exact',
		[WordlePoints.InWord]: 'letter-in-word',
		[WordlePoints.Missing]: 'letter-missing',
	};

	let colorCss: string = '';

	$: {
		if (result !== null && result !== undefined) {
			changeColors(result);
		}
	}

	function changeColors(result: WordlePoints) {
		colorCss = colors[result];
	}
</script>

<p
	class="w-[45px] h-[45px] border border-neutral-500 rounded-md flex justify-center items-center uppercase font-semibold bg-neutral-900
		{!char ? 'text-transparent' : ''} {colorCss} {klass}"
>
	{char || '_'}
</p>

<style>
	.letter-exact {
		@apply text-green-500;
	}

	.letter-in-word {
		@apply text-yellow-500;
	}

	.letter-missing {
		@apply text-neutral-500;
	}
</style>
