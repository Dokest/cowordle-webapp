import { Emitter } from './Emitter';

export type OnLetterCallback = (letter: string) => void;
export type OnBackspaceCallback = () => void;
export type OnEnterCallback = () => void;

export interface InputEmitterEvents {
	onLetter: OnLetterCallback;
	onBackspace: OnBackspaceCallback;
	onEnter: OnEnterCallback;
}

export class InputManager {
	readonly events: { [Key in keyof InputEmitterEvents]: Emitter<InputEmitterEvents[Key]> } = {
		onLetter: new Emitter(),
		onBackspace: new Emitter(),
		onEnter: new Emitter(),
	};

	initialized = false;

	readonly ignoredLetterInputs: string[] = [' ', 'Enter'];

	listen<TName extends keyof InputEmitterEvents>(name: TName, fn: InputEmitterEvents[TName]): void {
		if (!this.initialized) {
			this.init();
		}

		this.events[name].listen(fn);
	}

	remove<TName extends keyof InputEmitterEvents>(name: TName, fn: InputEmitterEvents[TName]): void {
		if (!this.initialized) {
			this.init();
		}

		this.events[name].remove(fn);
	}

	private init(): void {
		const body = document.getElementsByTagName('body')[0];

		body.addEventListener('keypress', (event) => {
			if (this.ignoredLetterInputs.includes(event.key)) {
				return;
			}

			this.events.onLetter.broadcast(event.key);
		});

		body.addEventListener('keydown', (event) => {
			if (event.code === 'Backspace') {
				this.events.onBackspace.broadcast();
			} else if (event.code === 'Enter') {
				this.events.onEnter.broadcast();
			}
		});

		this.initialized = true;
	}
}