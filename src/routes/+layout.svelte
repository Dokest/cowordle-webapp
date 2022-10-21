<script>
	import '../app.css';
</script>

<header
	class="mt-10 flex items-center justify-center text-[40px] font-semibold text-white cursor-default"
>
	<span class="titleLetter">C</span>
	<span class="titleLetter">o</span>
	<span class="titleLetter">W</span>
	<span class="titleLetter">o</span>
	<span class="titleLetter">r</span>
	<span class="titleLetter">d</span>
	<span class="titleLetter">l</span>
	<span class="titleLetter">e</span>
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
		@apply hover:text-orange-500 transition-colors hover:-translate-y-2 transition-transform;
	}
</style>
