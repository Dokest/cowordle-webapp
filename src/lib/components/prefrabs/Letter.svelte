<script lang="ts">
	export let char: string | null = null;
	let klass: string = '';

	export { klass as class };
</script>

<p
	class="w-[45px] h-[45px] border rounded-md flex justify-center items-center uppercase font-semibold
		{!char ? 'text-transparent' : ''} {klass}"
>
	{char || '_'}
</p>
