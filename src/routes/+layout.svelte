<script>
	import HelpSvg from '$lib/svgs/HelpSvg.svelte';
	import '../app.css';
</script>

<header
	class="py-3 flex items-baseline justify-center text-[40px] font-semibold text-white cursor-default select-none bg-neutral-900"
>
	<div class="flex items-center justify-center">
		<span class="titleLetter">C</span>
		<span class="titleLetter">o</span>
		<span class="titleLetter">W</span>
		<span class="titleLetter">o</span>
		<span class="titleLetter">r</span>
		<span class="titleLetter">d</span>
		<span class="titleLetter">l</span>
		<span class="titleLetter">e</span>
	</div>

	<div class="px-5">
		<HelpSvg class="w-7 my-auto" />
	</div>
</header>

<main class="text-white">
	<slot />
</main>

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
