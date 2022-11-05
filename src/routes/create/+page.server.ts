import { PUBLIC_API_URL } from '$env/static/public';

export async function load2({ request }: { request: Request }) {
	const response = await fetch(`${PUBLIC_API_URL}/create`, {
		method: 'POST',
	});

	const body = await response.json();
}


