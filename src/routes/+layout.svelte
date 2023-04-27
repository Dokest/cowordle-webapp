<script lang="ts">
	import ExitSvg from '$lib/svgs/ExitSvg.svelte';
	import HelpSvg from '$lib/svgs/HelpSvg.svelte';
	import '../app.css';

	let isFaqOpen = false;

	function openFaqDialog(): void {
		isFaqOpen = true;
	}

	function closeFaqDialog(): void {
		isFaqOpen = false;
	}
</script>

<header
	class="relative py-3 flex items-baseline justify-center text-[40px] font-semibold text-white cursor-default select-none"
>
	<div class="relative flex items-center justify-center">
		<span class="titleLetter">C</span>
		<span class="titleLetter">o</span>
		<span class="titleLetter">W</span>
		<span class="titleLetter">o</span>
		<span class="titleLetter">r</span>
		<span class="titleLetter">d</span>
		<span class="titleLetter">l</span>
		<span class="titleLetter">e</span>

		<button class="absolute left-full top-1/4 px-5" on:click={openFaqDialog}>
			<HelpSvg class="w-5 my-auto" />
		</button>
	</div>
</header>

<main class="text-white">
	<slot />
</main>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	open={isFaqOpen}
	class="absolute top-0 left-0 w-screen h-screen bg-neutral-800 bg-opacity-70"
	on:click={closeFaqDialog}
>
	<div
		on:click={(e) => {
			e.stopPropagation();
		}}
		class="relative px-3 py-4 space-y-2 w-full md:w-1/3 mx-auto mt-20 bg-neutral-900 text-white text-sm rounded-lg border border-neutral-500"
	>
		<h1 class="text-lg">How to play?</h1>
		<p>
			Co-Wordle is a Wordle-like game, where all players compete to complete a unknown word to
			all of them.
		</p>

		<p>
			You only have six tries to complete the word, each try will give you hints to get closer
			to the solution.
		</p>

		<h1 class="text-lg">Joining games</h1>
		<p>
			Join multiplayer games by using the <span class="font-bold underline">Join</span> button
			and looking for a room or by using a link given by one of the players of the room.
		</p>

		<button on:click={closeFaqDialog} class="absolute top-1 right-3 text-base">
			<ExitSvg />
		</button>
	</div>
</dialog>

<!-- <footer
	class="w-1/2 mx-auto mt-10 py-2 flex justify-center border-t border-white space-x-3 text-white"
>
	<a href="#">How to play?</a>
	<a href="#">FAQ</a>
	<a href="#">Settings</a>
</footer> -->
<style>
	.titleLetter {
		@apply hover:text-orange-500 transition-colors hover:-translate-y-1 transition-transform;
		_animation-name: appear;
		animation-duration: 500ms;
		animation-timing-function: ease-in-out;
		animation-fill-mode: forwards;
	}

	.titleLetter:nth-child(2) {
		animation-delay: 0.1s;
	}
	.titleLetter:nth-child(3) {
		animation-delay: 0.2s;
	}
	.titleLetter:nth-child(4) {
		animation-delay: 0.3s;
	}
	.titleLetter:nth-child(5) {
		animation-delay: 0.4s;
	}
	.titleLetter:nth-child(6) {
		animation-delay: 0.5s;
	}
	.titleLetter:nth-child(7) {
		animation-delay: 0.6s;
	}
	.titleLetter:nth-child(8) {
		animation-delay: 0.7s;
	}

	@keyframes appear {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
