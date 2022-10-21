
export async function load({ request }: { request: Request }) {
	const response = await fetch('http://localhost:5173/create', {
		method: 'POST',
	});

	const body = await response.json();
	console.log(body);
}
