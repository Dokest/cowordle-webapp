<script lang="ts">
	import LoadingParty from '$components/prefrabs/LoadingParty.svelte';
	import MainMenu from '$components/prefrabs/MainMenu.svelte';
	import { ws } from '$lib/ws/websockets';
	import { onMount } from 'svelte';

	let showLoadingScreen = false;

	onMount(() => {
		console.log('Message');

		const socket = $ws();

		console.log(socket);

		socket.emit('message', 'Hello!');

		socket.on('serverMessage', (data) => {
			console.log('Server says: ', data);
		});
	});
</script>

{#if showLoadingScreen}
	<LoadingParty />
{:else}
	<MainMenu />
{/if}

<!--
<div class="w-[80%] md:w-full h-full mx-auto mt-52 flex justify-center">
	{#if menu === 'name-selection'}
		<div class="flex flex-col justify-center items-center space-y-2">
			<p>Choose your nickname</p>
			<input
				type="text"
				bind:value={playerName}
				placeholder="Magic Squirrel"
				class="p-1 bg-transparent rounded-sm border-b"
			/>

			<div>
				<BasicButton text="Create party" on:click={advance} />
			</div>

			<div class="md:w-1/2 pt-5">
				<p class="text-sm italic">
					Create a new party to play with friends, or wait for them to send you a
					invitation link to their party.
				</p>
			</div>
		</div>
	{/if}
</div>
-->

<!--
<div class="text-center italic text-sm text-white">
	<p>{playersNum} playing right now!</p>
</div>

<div class="min-h-[500px] mt-[50px] flex flex-col items-center space-y-5 text-white">
	<div class="w-[80%] md:w-auto space-y-10 md:space-x-5">
		<div class="flex flex-col items-center justify-center space-y-1">
			<p>Choose your name</p>
			<input
				type="text"
				id="player-name"
				placeholder="Nickname"
				maxlength="20"
				class="p-1 bg-transparent rounded-sm border-b"
				bind:value={playerName}
			/>
		</div>

		{#if playerName}
			<div class="flex flex-col space-y-2" in:fade>
				<MainMenuButton text="Create party" href="/host" svg={SVG_Multiplayer} />

				<MainMenuButton text="Join party" href="/join" />

				<div
					class="flex flex-col space-x-0 md:space-x-2 md:flex-row space-y-2 md:space-y-0"
				>
					<MainMenuButton text="How to play?" href="guide" />

					<MainMenuButton text="FAQ" href="faq" />
				</div>
			</div>
		{/if}
	</div>
</div>
-->
