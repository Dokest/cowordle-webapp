
export interface RequestFormat<T> {
	error?: {
		code: number;
		message: string;
	};
	data?: T;
}

export async function externalRequest<T = unknown>(url: string, options: RequestInit): Promise<Response> {
	return await fetch(url, options)
		.catch(() => new Response('', {
			status: 503,
			statusText: 'Network failure',
		}));
}
