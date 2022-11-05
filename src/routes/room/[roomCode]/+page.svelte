<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { room } from '$lib/stores/roomStore';
	import { ws } from '$lib/stores/websocketStore';
	import { Player } from '$lib/types/Player';
	import { Room } from '$lib/types/Room';
	import { generateString } from '$lib/utils/randomString';
	import type { WebsocketConnection } from '$lib/ws/websockets';
	import { onMount } from 'svelte';
	import Lobby from './lobby.svelte';

	const roomCode: string = $page.params['roomCode'];

	let socket: WebsocketConnection;

	let roomState: 'lobby' | 'in-game' = 'lobby';

	if (!roomCode) {
		goto('/error?e=missing-partycode');
	}

	onMount(async () => {
		socket = $ws;

		const playerName = generateString(3);
		const localPlayer = new Player(playerName);

		socket.on('initial_local_info', ({ uuid }) => {
			localPlayer.uuid = uuid;
		});

		socket.on('initial_room_info', ({ players: allPlayers, host }) => {
			const newRoom = new Room(roomCode, host, localPlayer, allPlayers);

			room.init(newRoom);
		});

		socket.emit('setup', {
			playerName,
			roomCode,
		});
	});

	console.log(roomCode);
</script>

<div class="mt-5 w-[90%] md:w-[50%] mx-auto">
	{#if roomState === 'lobby'}
		<Lobby />
	{/if}
</div>
