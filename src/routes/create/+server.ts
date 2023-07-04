import { json } from '@sveltejs/kit';
import { wsServerRequest } from '../../lib/utils/apiRequest';


export async function POST(): Promise<Response> {
	let response: any;

	try {
		response = await wsServerRequest<{ code: string | null }>(`/create-room`, {
			method: 'GET',
		}).catch((error) => {
			console.error('Error wsServerRequest: [/create-room]', error);

			return {
				data: {
					code: null,
				},
				error: true,
			};
		});
	} catch (error) {
		console.log('Caught error in /create', error);
	}

	console.log('ROOM READY TO JOIN: ', response);

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
