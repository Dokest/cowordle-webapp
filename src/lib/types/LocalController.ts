import { Emitter } from '$lib/utils/Emitter';
import type { InputManager } from '$lib/utils/InputManager';
import { EN_WORDS } from '$lib/words/en_words';


export class LocalController {
	wordTries: string[] = [];

	readonly onChangeTries = new Emitter<(tries: string[]) => void>();
	readonly onSendWord = new Emitter<(word: string) => Promise<void>>();
	readonly onFailWord = new Emitter<(wordIndex: number) => void>();

	private currentWordIndex = 0;

	private acceptsInputs = false;

	connectionTimestamp = 0;


	constructor(private inputManager: InputManager, private maxTries: number, private wordLength: number) {
		this.wordTries.length = this.maxTries;
		this.wordTries = this.wordTries.fill('', 0, this.maxTries);

		this.bindKeys();
	}


	toggleInputs(shouldAcceptInput: boolean): void {
		this.acceptsInputs = shouldAcceptInput;
	}


	unbindAllEvents(): void {
		this.inputManager.unbindAll();
	}


	clearOldData(): void {
		this.wordTries = this.wordTries.fill('', 0, this.maxTries);
		this.currentWordIndex = 0;
	}


	private bindKeys(): void {
		this.inputManager.listen('onLetter', (letter: string) => {
			if (!this.acceptsInputs) {
				return;
			}

			const current = this.wordTries[this.currentWordIndex];

			if (current === '') {
				this.wordTries[this.currentWordIndex] = letter;
			} else if (current.length < this.wordLength) {
				this.wordTries[this.currentWordIndex] += letter;
			}

			this.onChangeTries.broadcast(this.wordTries);
		});

		this.inputManager.listen('onBackspace', () => {
			if (!this.acceptsInputs) {
				return;
			}

			const currentWord = this.wordTries[this.currentWordIndex];

			if (currentWord === null) {
				return;
			}

			this.wordTries[this.currentWordIndex] = currentWord.substring(0, currentWord.length - 1);

			this.onChangeTries.broadcast(this.wordTries);
		});

		this.inputManager.listen('onEnter', async () => {
			if (!this.acceptsInputs) {
				return;
			}

			const currentWord = this.wordTries[this.currentWordIndex];

			if (!currentWord) {
				throw new Error('input-error');
			}

			if (currentWord.length < this.wordLength) {
				return;
			}

			if (this.currentWordIndex < this.maxTries) {
				if (EN_WORDS.includes(currentWord)) {
					await this.onSendWord.broadcastAsync(currentWord);

					this.currentWordIndex++;
				} else {
					this.onFailWord.broadcast(this.currentWordIndex);
				}

			} else {
				console.log('FINISH');
			}
		});
	}
}
