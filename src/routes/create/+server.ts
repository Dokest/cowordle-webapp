import { wsServerRequest } from '$lib/utils/apiRequest';
import { generateString } from '$lib/utils/randomString';
import { json } from '@sveltejs/kit';

export async function POST(): Promise<Response> {
	const roomCode = generateString(6);

	const response = await wsServerRequest(`/create-room?code=${roomCode}`, {
		method: 'GET',
	});

	console.log(response);

	if (response.error) {
		return new Response(null, {
			status: 500,
		});
	}

	return json({
		data: { roomCode },
	});
}