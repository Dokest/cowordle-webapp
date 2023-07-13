<script lang="ts">
	import { goto } from '$app/navigation';
	import HomeSvg from '$lib/svgs/HomeSvg.svelte';
	import RefreshSvg from '$lib/svgs/RefreshSvg.svelte';

	export let reason: string;

	function reconnect(): void {
		window.location.reload();
	}

	function goBack(): void {
		goto('/');
	}
</script>

<div class="text-center flex flex-col gap-5">
	<p>You have been disconnected from the room</p>

	<p class="font-semibold">Reason: <span class="text-red-500">{reason}</span></p>

	<div>
		<div class="">
			<button
				on:click={reconnect}
				title="Try to reconnect"
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
</div>
