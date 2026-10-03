<script lang="ts">
	import { Logo, Socials, content } from '$lib/front'
</script>

<footer class="container relative py-8 md:py-10 border-t border-white/10">
	<div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5 items-start">
		<div class="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
			<div class="flex items-center gap-3">
				<Logo className="h-12 md:h-14" />
				<div class="text-sm leading-snug">
					<div class="font-hero font-bold italic text-xl">AT7ADAK</div>
					<div class="text-white/55">Compete. Play. Win.</div>
				</div>
			</div>
			<p class="text-xs sm:text-sm text-white/55 max-w-xs leading-relaxed">
				{content.operator}
			</p>
		</div>

		<nav
			class="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-white/60"
			aria-label="Footer"
		>
			<a href="/" class="hover:text-green trans py-1">Home</a>
			<a href="/how-it-works" class="hover:text-green trans py-1">How It Works</a>
			<a href="/download" class="hover:text-green trans py-1">Download</a>
			<a href="/privacy" class="hover:text-green trans py-1">Privacy Policy</a>
			<a href="/terms" class="hover:text-green trans py-1">Terms &amp; Conditions</a>
			<a href="/fair-play" class="hover:text-green trans py-1">Fair Play</a>
			<a href="/levels" class="hover:text-green trans py-1">Player Levels</a>
			<a href="/contact" class="hover:text-green trans py-1">Contact / Support</a>
		</nav>

		<div class="flex flex-col items-center md:items-end gap-3">
			<Socials />
			<div class="text-sm opacity-55 text-center md:text-right">
				&copy; {new Date().getFullYear()} AT7ADAK
			</div>
			<div class="text-xs text-white/40">18+ only. Terms apply.</div>
		</div>
	</div>

	<div class="text-center text-white/35 text-xs mt-8 md:mt-10 lg:px-[12vw] leading-relaxed whitespace-pre-line">
		{content.disclaimer}
	</div>
</footer>
