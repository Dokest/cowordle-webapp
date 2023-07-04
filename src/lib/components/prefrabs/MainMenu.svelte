<script lang="ts">
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { apiRequest } from '$utils/apiRequest';
	import Word from './Word.svelte';

	console.log('WS DOMAIN', env);

	async function host(): Promise<void> {
		const { data, error } = await apiRequest<{ roomCode: string }>('/create', {
			method: 'POST',
		});

		if (data) {
			const { roomCode } = data;
			goto(`/room/${roomCode}`);
		}
	}
</script>

<div class="h-96 mt-10 flex flex-col items-center gap-5">
	<button on:click={host} on:keydown={host} id="host_button">
		<Word word="Host" length={4} />
	</button>
	<a href="/join">
		<Word word="Join" length={4} />
	</a>
</div>
