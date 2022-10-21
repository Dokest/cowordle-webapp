import { json } from '@sveltejs/kit';
import type { Player } from 'lib/types/Player';
import type { ServerRequest } from 'lib/types/Server';

const players: Player[] = [];

export async function POST({ request }: ServerRequest) {
	return json({
		partyCode: 'x34bJH',
	});
}
