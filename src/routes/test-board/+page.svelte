<script lang="ts">
	import Keyboard from '$lib/components/boards/Keyboard.svelte';
	import WordleBoard from '$lib/components/boards/WordleBoard.svelte';
	import { gameManager } from '$lib/stores/gameManagerStore';
	import { ws } from '$lib/stores/websocketStore';
	import { LocalController } from '$lib/types/LocalController';
	import { GameManager } from '$lib/utils/GameManager';
	import { InputManager } from '$lib/utils/InputManager';
	import { onMount } from 'svelte';

	const MAX_TRIES = 5;
	const WORD_LENGTH = 5;

	let tries: (string | null)[] = [];
	tries.length = MAX_TRIES;
	tries = tries.fill(null, 0, MAX_TRIES);

	let currentTry = 0;

	const spectatorBoard = [...tries];

	onMount(() => {
		const newGameManager = new GameManager(
			'AAAA',
			new LocalController(new InputManager(), 5, 5),
			$ws,
			'test'
		);

		gameManager.set(newGameManager);

		$gameManager.getLocalController().onChangeTries.listen((playerTries) => {
			tries = playerTries;
		});

		// $input.listen('onLetter', (letter: string) => {
		// 	let current = tries[currentTry];

		// 	if (current === null) {
		// 		tries[currentTry] = letter;
		// 	} else if (current.length < WORD_LENGTH) {
		// 		tries[currentTry] += letter;
		// 	}
		// });

		// $input.listen('onBackspace', () => {
		// 	const currentWord = tries[currentTry];

		// 	if (currentWord === null) {
		// 		return;
		// 	}

		// 	tries[currentTry] = currentWord.substring(0, currentWord.length - 1);

		// 	tries = tries;
		// });

		// $input.listen('onEnter', () => {
		// 	console.log('ENTER');
		// });
	});
</script>

<div class="w-96 mx-auto">
	<WordleBoard {tries} wordLength={WORD_LENGTH} showOnlyColors={false} />

	<div class="my-5">
		<Keyboard usedLetters={[]} />
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
