import { externalRequest, type RequestFormat } from './externalRequest';

export async function serverRequest<T = unknown>(url: string, options: RequestInit): Promise<RequestFormat<T>> {
	const response = await externalRequest(url, options);

	if (!response.ok) {
		return {
			error: {
				code: response.status,
				message: response.statusText,
			},
		};
	}

	const body = await response.json();

	return body;
}

export async function apiRequest<T = unknown>(endpoint: string, options: RequestInit): Promise<RequestFormat<T>> {
	return serverRequest(`${endpoint}`, options);
}

export async function wsServerRequest<T = unknown>(endpoint: string, options: RequestInit): Promise<RequestFormat<T>> {
	return serverRequest(`http://websockets:9000${endpoint}`, options);
}
