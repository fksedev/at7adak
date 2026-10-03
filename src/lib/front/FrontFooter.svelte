<script lang="ts">
	import { Logo, Socials, content } from '$lib/front'
</script>

<footer class="container relative py-8 md:py-10 border-t border-white/10">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5 items-start">
		<div class="flex items-center gap-3 justify-center md:justify-start">
			<Logo className="h-12 md:h-14" />
			<div class="text-sm leading-snug">
				<div class="font-hero font-bold italic text-xl">AT7ADAK</div>
				<div class="text-white/55">Compete. Play. Win.</div>
			</div>
		</div>

		<nav
			class="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-white/60"
		>
			<a href="/" class="hover:text-green trans py-1">Home</a>
			<a href="/how-it-works" class="hover:text-green trans py-1">How It Works</a>
			<a href="/download" class="hover:text-green trans py-1">Download</a>
			<span class="opacity-40 cursor-default py-1" title="Coming soon">Privacy Policy</span>
			<span class="opacity-40 cursor-default py-1" title="Coming soon">Terms & Conditions</span>
		</nav>

		<div class="flex flex-col items-center md:items-end gap-3">
			<Socials />
			<div class="text-sm opacity-55">&copy; {new Date().getFullYear()} At7adak</div>
		</div>
	</div>

	<div class="text-center text-white/35 text-xs mt-8 md:mt-10 lg:px-[12vw] leading-relaxed">
		{content.disclaimer}
	</div>
</footer>
