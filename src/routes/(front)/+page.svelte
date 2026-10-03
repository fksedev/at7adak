<script lang="ts">
	import { Icon } from '$lib/front'
	import { Download, FrontHeader, FrontFooter, SeoSite, BtnSkew, content, PhoneHero } from '$lib/front'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
</script>

<SeoSite />

<div class="relative overflow-x-hidden">
	<div
		class="bg-[url('/assets/hero-bg.webp')] bg-no-repeat bg-cover bg-center min-h-[70vh] md:min-h-170 absolute inset-x-0 top-10 z-0 opacity-60"
	></div>

	<div class="absolute inset-x-0 top-10 h-40 bg-linear-to-b from-black to-transparent"></div>

	<div class="relative min-h-[70vh] md:min-h-170">
		<FrontHeader active="home" />

		<div class="container space-y-8 md:space-y-10 pb-8">
			<div class="md:max-w-150 mx-auto">
				<div class="flex flex-col md:flex-row md:items-center gap-8 md:gap-6">
					<div class="space-y-4 md:space-y-5 w-full text-center md:text-left relative z-10">
						<div class="font-hero font-bold italic">
							<h2 class="text-white text-4xl sm:text-5xl">The competition</h2>
							<h2 class="text-green text-5xl sm:text-6xl">Starts Now</h2>
						</div>

						<div
							class="leading-[1.35] text-sm sm:text-base text-white/90 max-w-md mx-auto md:mx-0"
						>
							At7adak is the ultimate competitive gaming app. Challenge real players, compete in
							matches, and win real money.
						</div>

						<div class="font-hero font-bold text-2xl sm:text-3xl italic">
							NO LUCK. <span class="text-green">ONLY SKILL.</span>
						</div>

						<div class="space-y-3">
							<div class="font-hero font-bold italic text-2xl sm:text-3xl text-green">
								DOWNLOAD AT7ADAK
							</div>
							<Download className="py-0 px-0" apk={data.apk} />
							<p class="text-xs sm:text-sm text-white/55 relative z-10">
								18+ only. Terms apply.
								<a href="/terms" class="underline underline-offset-2 hover:text-green trans"
									>Terms &amp; Conditions</a
								>
							</p>
						</div>
					</div>

					<!-- Phone sits in its own band so skew never overlaps the CTA / 18+ copy -->
					<div
						class="relative z-0 flex justify-center w-full md:w-auto shrink-0 pt-4 pb-2 md:pt-0 md:pb-0 px-6 sm:px-8"
					>
						<PhoneHero src="/assets/home.jpeg" alt="AT7ADAK Home" />
					</div>
				</div>
			</div>

			<div class="text-center text-sm text-white/50 space-y-1 pt-2 border-t border-white/5">
				<a href="/download" class="hover:text-green trans underline underline-offset-4">
					Installation guide &amp; FAQ →
				</a>
			</div>
		</div>
	</div>

	<div class="container relative">
		<div class="grid md:grid-cols-4 py-8 md:py-10 gap-8 md:gap-0 md:divide-x divide-border/50">
			<div class="md:pe-10 text-center md:text-left">
				<div class="font-hero font-bold italic text-3xl sm:text-4xl">
					WHAT IS <span class="text-green">AT7ADAK?</span>
				</div>
				<div class="text-sm mt-2 text-white/80 whitespace-pre-line">{content.what.text}</div>
			</div>

			{#each content.what.items as item, index}
				<div class="flex-center flex-col gap-1 text-green px-4 md:px-8 text-center">
					<div class="h-12 flex-center" class:text-red={index === 1}>
						<Icon name={item.icon} size={48} />
					</div>
					<div class="font-hero font-bold italic text-xl sm:text-2xl">{item.title}</div>
					<div class="text-white text-sm">{item.desc}</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="container relative py-8 md:py-10" id="games">
		<div class="font-hero font-bold italic text-3xl sm:text-4xl text-center mb-6">
			PLAY YOUR <span class="text-green">FAVORITE GAMES</span>
		</div>
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
			{#each content.games as game}
				<div
					class="rounded-xl border border-white/10 bg-[#0c151e]/80 px-3 py-5 text-center hover:border-green/40 trans"
				>
					<div class="text-green mb-2 flex-center">
						<Icon name="ion:game-controller" size={28} />
					</div>
					<div class="font-hero font-bold italic text-lg sm:text-xl leading-tight">{game}</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="container relative py-8 md:py-10" id="how">
		<div class="font-hero font-bold italic text-3xl sm:text-4xl text-center mb-4">
			<span class="text-green">HOW IT</span> WORKS
		</div>
		<p class="text-center text-sm text-white/50 mb-6">
			<a href="/how-it-works" class="hover:text-green trans underline underline-offset-4">
				See the full 7-step guide →
			</a>
		</p>

		<div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
			{#each content.how as item, index}
				<div
					class="flex-center flex-col gap-1 text-green p-6 sm:p-8 text-center border border-red/30 rounded-lg relative"
				>
					<div
						class="absolute top-3 left-3 font-hero font-bold italic text-green/20 text-5xl sm:text-6xl"
					>
						{index + 1}
					</div>
					<div class="h-12 flex-center" class:text-red={index === 1}>
						<Icon name={item.icon} size={48} />
					</div>
					<div class="font-hero font-bold italic text-xl sm:text-2xl">{item.title}</div>
					<div class="text-white text-sm">{item.desc}</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="container relative py-8 md:py-10">
		<div class="font-hero font-bold italic text-3xl sm:text-4xl text-center mb-4">
			<span class="text-green">WHY</span> AT7ADAK?
		</div>
		<div class="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
			{#each content.why as item, index}
				<div
					class="flex-center flex-col gap-1 text-green p-4 sm:p-8 text-center border border-border rounded-lg relative"
				>
					<div class="h-10 sm:h-12 flex-center" class:text-red={index === 1 || index === 3}>
						<Icon name={item.icon} size={40} />
					</div>
					<div class="font-hero font-bold italic text-lg sm:text-2xl leading-tight">{item.title}</div>
					<div class="text-white text-xs sm:text-sm">{item.desc}</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="container relative pb-2">
		<div class="border border-red/30 bg-red/10 rounded-lg p-4 sm:p-5">
			<div class="flex-between flex-col md:flex-row gap-5 text-center md:text-left">
				<div>
					<div class="font-hero font-bold italic text-2xl sm:text-4xl leading-none">
						THE COMPETITION STARTS <span class="text-green">NOW</span>
					</div>
					<div class="leading-none mt-2 text-sm sm:text-base lg:tracking-[0.18em]">
						PLAY. COMPETE. WIN REWARDS.
					</div>
					<p class="text-xs text-white/50 mt-2">18+ only. Terms apply.</p>
				</div>

				<div class="space-y-2 shrink-0 w-full md:w-auto">
					<div class="flex flex-col sm:flex-row gap-2 justify-center md:justify-end">
						<BtnSkew icon="mdi:apple" href="/download#get-app" className="justify-center w-full sm:w-auto">
							App Store
						</BtnSkew>
						<BtnSkew
							icon="mdi:android"
							href="/download#get-app"
							className="bg-transparent border border-green text-green hover:bg-green/10 justify-center w-full sm:w-auto"
						>
							Android APK
						</BtnSkew>
					</div>
				</div>
			</div>
		</div>
	</div>

	<FrontFooter />
</div>
