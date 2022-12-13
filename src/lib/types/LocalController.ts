import { Emitter } from '$lib/utils/Emitter';
import type { InputManager } from '$lib/utils/InputManager';

export class LocalController {
	readonly wordTries: (string | null)[] = [];

	readonly onChangeTries = new Emitter<(tries: (string | null)[]) => void>();

	private currentWordIndex = 0;

	connectionTimestamp = 0;


	constructor(private inputManager: InputManager, private maxTries: number, private wordLength: number) {
		this.wordTries.length = this.maxTries;
		this.wordTries = this.wordTries.fill(null, 0, this.maxTries);

		this.bindKeys();
	}


	private bindKeys(): void {
		this.inputManager.listen('onLetter', (letter: string) => {
			const current = this.wordTries[this.currentWordIndex];

			if (current === null) {
				this.wordTries[this.currentWordIndex] = letter;
			} else if (current.length < this.wordLength) {
				this.wordTries[this.currentWordIndex] += letter;
			}

			this.onChangeTries.broadcast(this.wordTries);
		});

		this.inputManager.listen('onBackspace', () => {
			const currentWord = this.wordTries[this.currentWordIndex];

			if (currentWord === null) {
				return;
			}

			this.wordTries[this.currentWordIndex] = currentWord.substring(0, currentWord.length - 1);

			this.onChangeTries.broadcast(this.wordTries);
		});

		this.inputManager.listen('onEnter', () => {
			const currentWord = this.wordTries[this.currentWordIndex];

			if (!currentWord) {
				throw new Error('input-error');
			}

			if (currentWord.length < this.wordLength) {
				return;
			}

			if (this.currentWordIndex < this.maxTries) {
				this.currentWordIndex++;
				// TODO: Send word to the backend
			} else {
				console.log('FINISH');
			}
		});
	}
}
