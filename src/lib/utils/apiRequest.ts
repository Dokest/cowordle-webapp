
export interface ApiRequestFormat<T> {
	error?: {
		code: number;
		message: string;
	};
	data?: T;
}

export async function apiRequest<T = unknown>(endpoint: string, options: RequestInit): Promise<ApiRequestFormat<T>> {
	const response = await fetch(`http://localhost:5173${endpoint}`, options)
		.catch(() => new Response('', {
			status: 503,
			statusText: 'Network failure',
		}));

	if (!response.ok) {
		return {
			error: {
				code: response.status,
				message: response.statusText,
			},
		};
	}

	const body = await response.json();

	return {
		data: body,
	};
}
