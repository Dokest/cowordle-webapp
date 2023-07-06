<script lang="ts">
	import { goto } from '$app/navigation';
	import Word from '$lib/components/prefrabs/Word.svelte';

	let code: string = '';
	let isCodeComplete = true;

	$: {
		code = formatCode(code);

		isCodeComplete = code.length === 6;
	}

	function formatCode(newCode: string): string {
		return newCode.substring(0, 6);
	}

	function goToRoom(): void {
		goto(`/room/${code.toUpperCase()}`);
	}
</script>

<div class="mt-5 w-[90%] md:w-[50%] mx-auto flex flex-col items-center gap-3">
	<h2 class="text-xl font-semibold">JOIN A ROOM</h2>
	<p>Use the room code given by a player to join their match.</p>

	<div class="">
		<label for="code_input">
			<Word bind:word={code} length={6} />
		</label>

		<input
			type="text"
			name="code_input"
			id="code_input"
			bind:value={code}
			class="absolute opacity-0 pointer-events-none scale-0"
		/>
	</div>

	<button
		on:click={goToRoom}
		disabled={!isCodeComplete}
		class="px-2 py-1 border-2 rounded-lg font-semibold {isCodeComplete
			? 'border-green-700 bg-neutral-900'
			: 'border-neutral-900'}">Join!</button
	>

	<p class="text-sm">
		<span class="font-bold text-base">TIP!</span> You can also use the link directly to join the
		room.
	</p>
</div>
