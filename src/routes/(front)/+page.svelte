<script lang="ts">
	import { Icon } from '$lib/front'
	import { Download, FrontHeader, FrontFooter, SeoSite, BtnSkew, content, DualPhones } from '$lib/front'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	const trust = [
		{ icon: 'solar:shield-check-bold', label: 'Safe & Secure' },
		{ icon: 'lucide:zap', label: 'Real Rewards' },
		{ icon: 'clarity:users-line', label: 'Active Community' },
		{ icon: 'solar:cup-star-bold', label: 'Exciting Tournaments' }
	]
</script>

<SeoSite />

<div class="relative overflow-x-hidden">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(92vh,920px)] bg-[url('/assets/hero-bg.webp')] bg-cover bg-center bg-no-repeat opacity-70"
	></div>
	<div
		class="pointer-events-none absolute inset-x-0 top-0 z-0 h-36 bg-linear-to-b from-black via-black/50 to-transparent"
	></div>
	<div
		class="pointer-events-none absolute inset-x-0 top-[min(62vh,640px)] z-0 h-48 bg-linear-to-t from-black via-black/55 to-transparent"
	></div>

	<div class="relative">
		<FrontHeader active="home" />

		<section class="container pb-8 lg:pb-12 pt-1 lg:pt-2">
			<div
				class="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-5 lg:gap-2 xl:gap-4 items-start lg:items-center"
			>
				<!-- Left column: copy + downloads + trust + games -->
				<div class="space-y-4 lg:space-y-5 text-center lg:text-left relative z-10 order-1">
					<h1 class="font-hero font-bold italic leading-[0.9] tracking-tight">
						<span class="block text-white text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-7xl"
							>PLAY.</span
						>
						<span class="block text-green text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-7xl"
							>COMPETE.</span
						>
						<span class="block text-white text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-7xl"
							>WIN.</span
						>
					</h1>

					<p class="text-white/75 text-sm sm:text-base max-w-md mx-auto lg:mx-0 leading-relaxed">
						Challenge players in your favorite games, join tournaments and win real rewards.
					</p>

					<div class="space-y-1.5">
						<Download className="py-0 px-0" apk={data.apk} />
						<p class="text-xs text-white/45">
							18+ only. Terms apply.
							<a href="/terms" class="underline underline-offset-2 hover:text-green trans"
								>Terms &amp; Conditions</a
							>
						</p>
					</div>

					<div class="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2">
						{#each trust as item}
							<div class="flex items-center gap-2">
								<span class="text-[#e8f07a]"><Icon name={item.icon} size={20} /></span>
								<span class="text-xs sm:text-sm text-white/80 whitespace-nowrap">{item.label}</span>
							</div>
						{/each}
					</div>

					<!-- Games under left column like mockup -->
					<div class="pt-1" id="games">
						<div
							class="font-hero font-bold italic text-sm sm:text-base mb-2.5 tracking-wide text-white/95"
						>
							PLAY YOUR FAVORITE GAMES
						</div>
						<div class="flex flex-wrap justify-center lg:justify-start gap-2.5 sm:gap-3.5">
							{#each content.games as game}
								<div class="flex flex-col items-center gap-1 w-[4.25rem] sm:w-[4.75rem]">
									<div
										class="size-12 sm:size-14 rounded-xl border border-green/60 bg-black/80 flex-center text-green shadow-[0_0_24px_rgba(198,223,40,0.22)]"
									>
										<Icon name={game.icon} size={24} />
									</div>
									<div class="text-[10px] text-white/70 text-center leading-tight">
										{game.name}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Right: dual phones -->
				<div
					class="relative z-0 order-2 flex justify-center lg:justify-center xl:justify-end py-2 lg:py-0 lg:-ms-4"
				>
					<DualPhones />
				</div>
			</div>

			<div class="text-center text-sm text-white/45 pt-8">
				<a href="/download" class="hover:text-green trans underline underline-offset-4">
					Installation guide &amp; FAQ →
				</a>
			</div>
		</section>
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
						PLAY. <span class="text-green">COMPETE.</span> WIN.
					</div>
					<div class="leading-none mt-2 text-sm sm:text-base lg:tracking-[0.18em]">
						DOWNLOAD AT7ADAK AND START COMPETING.
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
