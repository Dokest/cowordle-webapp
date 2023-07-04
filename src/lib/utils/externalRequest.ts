
export interface RequestFormat<T> {
	error?: {
		code: number;
		message: string;
	};
	data?: T;
}

export async function externalRequest(url: string, options: RequestInit): Promise<Response> {
	return fetch(url, options);
}
