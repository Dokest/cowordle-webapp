<script lang="ts">
	import { draw, type DrawParams } from 'svelte/transition';

	let klass: string = 'h-5 w-5';
	export { klass as class };

	export let drawParams: DrawParams = {};
	export let animate = false;

	function animation(...args: Parameters<typeof draw>) {
		if (animate) {
			return draw(args[0], args[1]);
		}

		return null as any as ReturnType<typeof draw>;
	}
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke-width="1.5"
	stroke="currentColor"
	class={klass}
>
	<path
		in:animation={drawParams}
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M4.5 12.75l6 6 9-13.5"
	/>
</svg>
