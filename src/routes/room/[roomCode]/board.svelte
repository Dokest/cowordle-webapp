<script lang="ts">
	import WordleBoard from '$lib/components/boards/WordleBoard.svelte';
	import { gameManager } from '$lib/stores/gameManagerStore';

	let controller = $gameManager.getLocalController();

	let tries: (string | null)[] = [];
	$: {
		controller.onChangeTries.listen((newTries) => {
			tries = newTries;
		});
	}
</script>

<div>
	<WordleBoard showOnlyColors={false} {tries} wordLength={5} />
</div>
