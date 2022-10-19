<script>
	import '../app.css';
</script>

<header
	class="mt-10 flex items-center justify-center text-[40px] font-semibold text-white cursor-default"
>
	<span class="hover:text-orange-500 transition-colors">W</span>
	<span class="hover:text-orange-500 transition-colors">o</span>
	<span class="hover:text-orange-500 transition-colors">r</span>
	<span class="hover:text-orange-500 transition-colors">d</span>
	<span class="hover:text-orange-500 transition-colors">l</span>
	<span class="hover:text-orange-500 transition-colors">e</span>
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
