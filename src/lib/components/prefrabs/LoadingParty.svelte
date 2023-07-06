<script lang="ts">
	import { goto } from '$app/navigation';
	import HomeSvg from '$lib/svgs/HomeSvg.svelte';
	import RefreshSvg from '$lib/svgs/RefreshSvg.svelte';

	let gameSearchFailed = false;

	setTimeout(gameNotFound, 10000);

	function gameNotFound(): void {
		gameSearchFailed = true;
	}

	function retry(): void {
		window.location.reload();
	}

	function goBack(): void {
		goto('/');
	}
</script>

<div class="mt-32 flex justify-center">
	{#if gameSearchFailed}
		<div class="px-8 py-3 flex flex-col items-center space-y-5 bg-neutral-900 rounded-lg">
			<p class="font-semibold">Could not find party</p>

			<div class="">
				<button
					on:click={retry}
					title="Retry"
					class="px-3 py-2 border rounded-lg font-semibold cursor-pointer disabled:cursor-default bg-neutral-900"
				>
					<RefreshSvg />
				</button>

				<button
					on:click={goBack}
					title="Go back"
					class="px-3 py-2 border rounded-lg font-semibold cursor-pointer disabled:cursor-default bg-neutral-900"
				>
					<HomeSvg />
				</button>
			</div>
		</div>
	{:else}
		<div class="px-8 py-3 flex flex-col items-center space-y-5 bg-neutral-900 rounded-lg">
			<p class="font-semibold">Loading party</p>

			<div class="rounded-full border-2 border-t-transparent border-orange-500 animate-spin">
				<div
					class="rounded-full border border-l-transparent border-r-transparent border-transparent"
				>
					<div class="relative p-3 m-[3px] rounded-full bg-orange-600 " />
				</div>
			</div>
		</div>
	{/if}
</div>
