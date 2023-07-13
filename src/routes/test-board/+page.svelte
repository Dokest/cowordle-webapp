<script lang="ts">
	import Keyboard from '$lib/components/boards/Keyboard.svelte';
	import WordleBoard from '$lib/components/boards/WordleBoard.svelte';
	import { gameManager } from '$lib/stores/gameManagerStore';
	import { LocalController } from '$lib/types/LocalController';
	import { GameManager } from '$lib/utils/GameManager';
	import { InputManager } from '$lib/utils/InputManager';
	import { WebsocketConnection } from '$lib/ws/websockets';
	import { onMount } from 'svelte';

	const MAX_TRIES = 6;
	const WORD_LENGTH = 5;

	let tries: string[] = [];
	tries.length = MAX_TRIES;
	tries = tries.fill('', 0, MAX_TRIES);

	onMount(() => {
		const ws = new WebsocketConnection();

		const newGameManager = new GameManager(
			'AAAA',
			new LocalController(new InputManager(), MAX_TRIES, WORD_LENGTH),
			ws,
			'test'
		);

		gameManager.set(newGameManager);

		// $gameManager.getLocalController().onChangeTries.listen((playerTries) => {
		// 	tries = playerTries;
		// });
	});
</script>

<div class="w-96 mx-auto">
	<WordleBoard {tries} wordLength={WORD_LENGTH} showOnlyColors={false} />

	<div class="my-5">
		<Keyboard />
	</div>

	<!-- < div class="absolute top-0 left-0 -z-10" >//</div> -->
	<!-- < div class="absolute top-0 left-0 w-full -z-20" >
					<div class="w-full flex justify-evenly" >
						<div>
						<div class="blur-[1px] opacity-[0.25]" >
							<BasicWordleBoard tries={ spectatorBoard } wordLength = { WORD_LENGTH } />
								</div>
								< p > asdasd < /p>
								< /div>
								< div >
								<div class="blur-[0px] opacity-[0.25]" >
									<BasicWordleBoard tries={ spectatorBoard } wordLength = { WORD_LENGTH } />
										</div>
										< p > asdasd < /p>
										< /div>
										< /div>
										< /div> -->
</div>
