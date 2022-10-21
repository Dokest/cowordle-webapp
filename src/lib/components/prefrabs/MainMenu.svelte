<script lang="ts">
	import { goto } from '$app/navigation';
	import { apiRequest } from '$utils/apiRequest';
	import Word from './Word.svelte';

	async function host(): Promise<void> {
		const { data, error } = await apiRequest<{ partyCode: string }>('/create', {
			method: 'POST',
		});

		if (data) {
			const { partyCode } = data;
			goto(`/party/${partyCode}`);
		}
	}
</script>

<div class="mt-10 flex flex-col items-center gap-5">
	<div on:click={host} on:keydown={host}>
		<Word word="Host" length={5} />
	</div>
	<a href="/join">
		<Word word="Join" length={5} />
	</a>
	<a href="/faq">
		<Word word="Help" length={5} />
	</a>
</div>
