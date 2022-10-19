<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let text: string;

	let klass: string = '';
	export { klass as class };

	const events = createEventDispatcher();

	function onClick(e: Event): void {
		events('click', e);
	}
</script>

<button
	class="px-3 py-1 border rounded disabled:border-neutral-500 disabled:bg-neutral-700 {klass}"
	on:click={onClick}
>
	{text}
</button>
