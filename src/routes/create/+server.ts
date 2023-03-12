import { wsServerRequest } from '$lib/utils/apiRequest';
import { json } from '@sveltejs/kit';


export async function POST(): Promise<Response> {
	const response = await wsServerRequest<{ code: string }>(`/create-room`, {
		method: 'GET',
	});

	if (response?.error) {
		return new Response('Can not connect to the WS server', {
			status: 500,
		});
	}

	const code = response.data?.code;

	return json({
		data: { roomCode: code },
	});
}