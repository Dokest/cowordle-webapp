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
	console.log('QUERY API -> ', endpoint);

	return serverRequest(endpoint, options);
}

export async function wsServerRequest<T = unknown>(endpoint: string, options: RequestInit): Promise<RequestFormat<T>> {
	console.log('QUERY WS -> ', `http://localhost:9000${endpoint}`);

	return serverRequest(`http://localhost:9000${endpoint}`, options)
		.catch((e) => {
			console.log('Error on server request', e);
			return e;
		});
}
