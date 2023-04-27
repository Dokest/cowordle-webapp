
export class Emitter<T extends (...args: any[]) => void> {
	private callbacks: T[] = [];

	broadcast(...params: Parameters<T>): void {
		this.callbacks.forEach(callback => { callback(...params) });
	}

	async broadcastAsync(...params: Parameters<T>): Promise<void> {
		for await (const callback of this.callbacks) {
			await callback(params);
		}
	}

	listen(callback: T): void {
		this.callbacks.push(callback);
	}

	remove(callback: T): void {
		this.callbacks = this.callbacks.filter((existingCallback) => existingCallback !== callback);
	}

	clear(): void {
		this.callbacks = [];
	}
}
