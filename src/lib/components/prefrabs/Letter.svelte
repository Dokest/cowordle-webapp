<script lang="ts">
	export let char: string | null = null;
	let klass: string = '';

	export { klass as class };
</script>

<p
	class="w-[45px] h-[45px] border border-neutral-500 rounded-md flex justify-center items-center uppercase font-semibold bg-neutral-900
		{!char ? 'text-transparent' : ''} {klass}"
>
	{char || '_'}
</p>
