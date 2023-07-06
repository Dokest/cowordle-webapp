import { Emitter } from '$lib/utils/Emitter';
import type { InputManager } from '$lib/utils/InputManager';

export interface WordListData {
	validWords: string[];
	selectableWords: string[]
}


export class LocalController {
	wordTries: string[] = [];

	readonly onChangeTries = new Emitter<(tries: string[]) => void>();
	readonly onSendWord = new Emitter<(word: string) => Promise<void>>();
	readonly onFailWord = new Emitter<(wordIndex: number) => void>();

	private currentWordIndex = 0;

	private acceptsInputs = false;

	connectionTimestamp = 0;

	private knownLetters: (string | null)[] = [];

	private wordList: WordListData = {
		selectableWords: [],
		validWords: [],
	};


	constructor(private inputManager: InputManager, private maxTries: number, private wordLength: number) {
		this.wordTries.length = this.maxTries;
		this.knownLetters.length = this.wordLength;
		this.clearInputs();

		this.bindKeys();
	}


	toggleInputs(shouldAcceptInput: boolean): void {
		this.acceptsInputs = shouldAcceptInput;
	}

	clearInputs(): void {
		this.currentWordIndex = 0;
		this.wordTries = this.wordTries.fill('', 0, this.maxTries);
		this.knownLetters = this.knownLetters.fill(null, 0, this.wordLength);
	}


	unbindAllEvents(): void {
		this.inputManager.unbindAll();
	}


	clearOldData(): void {
		this.wordTries = this.wordTries.fill('', 0, this.maxTries);
		this.knownLetters = this.knownLetters.fill(null, 0, this.wordLength);
		this.currentWordIndex = 0;
	}


	getInputManager(): InputManager {
		return this.inputManager;
	}


	getLastTry(): string {
		return this.wordTries[this.currentWordIndex];
	}


	addKnownLetter(letter: string, index: number): void {
		this.knownLetters[index] = letter;
	}


	getKnownLettersFormatted(): string {
		return [...this.knownLetters]
			.map((letter) => letter === null ? '?' : letter)
			.join('');
	}


	setWordList(lists: WordListData): void {
		this.wordList = lists;
	}


	private canAcceptKeyInput(): boolean {
		return this.acceptsInputs && this.currentWordIndex < this.maxTries;
	}


	private bindKeys(): void {
		this.inputManager.listen('onLetter', (letter: string) => {
			if (!this.canAcceptKeyInput()) {
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
			if (!this.canAcceptKeyInput()) {
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
			if (!this.canAcceptKeyInput()) {
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
				console.log('Trying word: ', this.wordList.validWords.includes(currentWord), currentWord);

				if (this.wordList.validWords.includes(currentWord)) {
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
