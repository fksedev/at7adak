<script lang="ts">
	import {
		Download,
		FrontHeader,
		FrontFooter,
		SeoSite,
		Icon,
		PhoneHero,
		downloads,
		appStoreReady,
		androidReady
	} from '$lib/front'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	const apk = $derived(data.apk)

	const features = [
		{ icon: 'ion:game-controller', label: 'PLAY', sub: 'Your Favorite Games' },
		{ icon: 'solar:cup-star-bold', label: 'COMPETE', sub: 'In Real Tournaments' },
		{ icon: 'mdi:crown', label: 'WIN', sub: 'Real Rewards' }
	]

	const benefits = [
		{ icon: 'solar:shield-check-bold', title: 'Official AT7ADAK APK', desc: 'Signed release from AT7ADAK' },
		{ icon: 'lucide:zap', title: 'Direct from AT7ADAK', desc: 'Served from at7adak.com only' },
		{ icon: 'mdi:cog-outline', title: 'Easy Installation', desc: 'Step-by-Step Guide' },
		{ icon: 'mdi:sync', title: 'Regular Updates', desc: 'Install over your existing app' }
	]

	const steps = [
		{
			n: 1,
			title: 'Download the APK',
			desc: 'Tap “Download for Android (APK)” and save the official AT7ADAK file to your phone.',
			hint: 'Browser download'
		},
		{
			n: 2,
			title: 'Allow Installation',
			desc: 'If Android asks, enable “Install unknown apps” / “Allow from this source” for your browser (Chrome / Files).',
			hint: 'Install unknown apps'
		},
		{
			n: 3,
			title: 'Tap Install anyway',
			desc: 'Open the APK. Google Play Protect or Android may warn that the app is not from Play Store — that is normal for our official website APK. Tap Install anyway / Install / More details → Install anyway.',
			hint: 'Install anyway'
		},
		{
			n: 4,
			title: 'Open and Play',
			desc: 'Launch AT7ADAK from your home screen, create your account, and start competing.',
			hint: 'AT7ADAK'
		}
	]

	const faqs = $derived([
		{
			q: 'Is it safe to download the APK?',
			a: 'Yes. This is the official AT7ADAK APK, signed by AT7ADAK and served over HTTPS from at7adak.com. Only download from this website — never from third-party APK sites.'
		},
		{
			q: 'Android says “Install anyway” — should I continue?',
			a: 'Yes. Because AT7ADAK is installed from our website (not Google Play), Android / Play Protect often shows a warning. If you downloaded from at7adak.com, tap Install anyway (or More details → Install anyway) to install the official app.'
		},
		{
			q: 'Why is AT7ADAK not on Google Play?',
			a: 'Android is currently distributed as a direct APK from our website. iOS is available on the App Store. Google Play availability may follow later.'
		},
		{
			q: 'How do I update to a new version?',
			a: 'When a new version is released, download the latest official APK from this page and install it over your existing AT7ADAK app. Do not uninstall first unless we specifically ask you to — keeping the app installed preserves your data when the update is signed with the same key.'
		},
		{
			q: 'What Android version is required?',
			a: `${apk?.androidMin ?? downloads.androidMin} is required. During install, allow “Install unknown apps” for the browser you used to download the file.`
		},
		{
			q: 'Is AT7ADAK 18+?',
			a: 'Yes. AT7ADAK is for users aged 18 and over. Entry fees, balances, and withdrawals are subject to our Terms & Conditions.'
		},
		{
			q: 'When can I withdraw?',
			a: 'Withdrawals unlock at Level 2 (Active): 5+ completed matches and $30+ total played amount, up to $100/day. Level 3 (Trusted) raises that to $300/day. Level 1 players cannot withdraw yet. Full details are on the Player Levels page.'
		}
	])

	const qrTarget = downloads.pageUrl
	const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&bgcolor=ffffff&color=000000&qzone=1&data=${encodeURIComponent(qrTarget)}`
</script>

<SeoSite
	title="Download AT7ADAK – App Store & Android APK"
	description="Download AT7ADAK for iOS on the App Store or get the official Android APK from at7adak.com. Compete, play, and win real rewards."
/>

<div class="relative min-h-screen overflow-x-hidden">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-[min(85vh,820px)] bg-[url('/assets/hero-bg.webp')] bg-cover bg-center opacity-50"
	></div>
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black via-black/70 to-transparent"
	></div>
	<div
		class="pointer-events-none absolute inset-x-0 top-[55vh] h-48 bg-linear-to-b from-transparent to-black"
	></div>

	<div class="relative">
		<FrontHeader active="download" />

		<!-- 2. Hero -->
		<section class="container pt-4 pb-8 md:pt-8 md:pb-16">
			<div class="grid lg:grid-cols-2 gap-8 lg:gap-6 items-center">
				<div class="space-y-4 md:space-y-5 max-w-xl text-center lg:text-left mx-auto lg:mx-0">
					<div class="font-hero font-bold italic leading-[0.9]">
						<h1 class="text-white text-5xl sm:text-6xl md:text-7xl tracking-wide">AT7ADAK</h1>
						<p class="text-green text-3xl sm:text-4xl md:text-5xl mt-1">Compete. Play. Win.</p>
					</div>
					<p class="text-white/80 text-sm sm:text-base md:text-lg leading-snug">
						Join real players, enter tournaments, and win real rewards.
					</p>
					<div class="flex flex-wrap justify-center lg:justify-start gap-5 md:gap-8 pt-2">
						{#each features as item}
							<div class="flex items-start gap-2.5 min-w-[6.5rem]">
								<div class="text-green mt-0.5"><Icon name={item.icon} size={26} /></div>
								<div class="text-left">
									<div class="font-hero font-bold italic text-base sm:text-lg leading-none">{item.label}</div>
									<div class="text-[11px] text-white/55 mt-0.5 leading-tight">{item.sub}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="relative flex justify-center lg:justify-end min-h-48 sm:min-h-64">
					<div class="relative z-10 drop-shadow-2xl">
						<PhoneHero
							src="/assets/home.jpeg"
							alt="AT7ADAK Home"
							imgClass="!w-[40vw] !max-w-52 sm:!max-w-72 md:!max-w-80 md:!w-auto"
						/>
					</div>
					<div
						class="absolute right-2 md:right-10 top-10 opacity-55 hidden sm:block pointer-events-none scale-90 origin-top"
						aria-hidden="true"
					>
						<PhoneHero
							src="/assets/match.jpeg"
							alt=""
							imgClass="!w-[35vw] !max-w-48 md:!max-w-72"
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- 3. Download + 4. Benefits -->
		<section class="container pb-10 md:pb-14" id="get-app">
			<div class="rounded-2xl border border-white/10 bg-[#0a0e12]/90 backdrop-blur-md p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8">
				<div class="text-center md:text-left space-y-2">
					<h2 class="font-hero font-bold italic text-3xl sm:text-4xl md:text-5xl">
						Download <span class="text-green">AT7ADAK</span>
					</h2>
					<p class="text-white/65 max-w-2xl text-sm sm:text-base">
						Get the app now and start competing on your favorite games.
					</p>
				</div>

				<div class="grid lg:grid-cols-[1fr_auto] gap-6 lg:gap-12 items-start">
					<div class="space-y-3 w-full">
						<Download detailed className="" apk={apk} />
						<p class="text-xs sm:text-sm text-white/55 px-1">
							18+ only. Terms apply.
							<a href="/terms" class="underline underline-offset-2 hover:text-green trans"
								>Terms &amp; Conditions</a
							>
						</p>
						{#if !appStoreReady() || !androidReady(apk)}
							<p class="text-amber-400/80 text-xs px-1">
								{#if !appStoreReady() && !androidReady(apk)}
									App Store URL and APK pending.
								{:else if !appStoreReady()}
									App Store URL pending.
								{:else}
									Android APK not published yet — upload it via /apk-update.
								{/if}
							</p>
						{/if}
					</div>

					<!-- QR mainly for desktop users scanning to phone -->
					<div class="hidden sm:flex flex-col items-center gap-2.5 mx-auto lg:mx-0">
						<div class="bg-white rounded-xl p-3 shadow-[0_0_48px_rgba(198,223,40,0.15)]">
							<img
								src={qrSrc}
								alt="QR code — scan to open the AT7ADAK download page"
								width="200"
								height="200"
								class="size-[140px] md:size-[200px] rounded-md"
							/>
						</div>
						<p class="text-sm text-white/70 text-center max-w-44 leading-snug">
							Scan to Download on Your Phone
						</p>
					</div>
				</div>

				<div class="pt-5 md:pt-6 border-t border-white/10 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
					{#each benefits as b}
						<div class="flex items-start gap-3">
							<div class="text-green shrink-0"><Icon name={b.icon} size={28} /></div>
							<div>
								<div class="font-semibold text-sm md:text-base leading-tight">{b.title}</div>
								<div class="text-xs text-white/45 mt-0.5">{b.desc}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- 5. Installation steps -->
		<section class="container pb-10 md:pb-14">
			<div class="text-center mb-6 md:mb-8 space-y-2">
				<h2 class="font-hero font-bold italic text-3xl sm:text-4xl md:text-5xl">
					How to Install on <span class="text-green">Android</span>
				</h2>
				<p class="text-white/55 text-sm max-w-xl mx-auto px-1">
					Follow these steps to install the official AT7ADAK APK on your phone.
				</p>
			</div>

			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
				{#each steps as step}
					<div
						class="group border border-white/10 rounded-2xl overflow-hidden bg-[#0c151e]/80 hover:border-green/40 trans"
					>
						<div
							class="h-36 md:h-40 bg-linear-to-br from-black via-[#121820] to-[#1a2410] flex-center relative border-b border-white/5"
						>
							<div
								class="absolute top-3 left-3 size-8 rounded-full bg-green text-black font-hero font-bold italic text-xl flex-center shadow-[0_0_20px_rgba(198,223,40,0.35)]"
							>
								{step.n}
							</div>
							<div
								class="w-[72%] max-w-40 rounded-xl border border-white/15 bg-black/70 px-3 py-4 text-center shadow-lg"
							>
								{#if step.n === 4}
									<img src="/logo-trans.png" alt="" class="h-12 mx-auto object-contain" />
									<div class="text-[11px] text-white/70 mt-2">Open AT7ADAK</div>
								{:else}
									<div class="text-green mb-2 flex-center">
										<Icon
											name={step.n === 1
												? 'mdi:download'
												: step.n === 2
													? 'mdi:shield-check-outline'
													: 'mdi:cellphone-arrow-down'}
											size={28}
										/>
									</div>
									<div class="text-[11px] text-white/70 leading-snug">{step.hint}</div>
								{/if}
							</div>
						</div>
						<div class="p-4 space-y-1.5">
							<div class="font-hero font-bold italic text-lg text-green leading-none">
								{step.title}
							</div>
							<p class="text-sm text-white/65 leading-relaxed">{step.desc}</p>
						</div>
					</div>
				{/each}
			</div>

			<p class="text-center text-xs sm:text-sm text-white/45 mt-6 max-w-2xl mx-auto leading-relaxed">
				Android / Play Protect may show <span class="text-white/70">Install anyway</span> because the app
				is not from Google Play. That is expected for our official website APK — tap yes / Install anyway
				if you downloaded from at7adak.com only.
			</p>
		</section>

		<!-- Always-visible update guidance (not hidden behind an accordion) -->
		<section class="container pb-10 md:pb-14" id="update">
			<div
				class="rounded-2xl border border-green/30 bg-green/5 p-5 sm:p-8 max-w-3xl mx-auto space-y-3"
			>
				<h2 class="font-hero font-bold italic text-2xl sm:text-3xl md:text-4xl text-center">
					How to <span class="text-green">Update</span> AT7ADAK
				</h2>
				<p class="text-sm sm:text-base text-white/75 leading-relaxed text-center">
					When a new version is released, download the latest official APK from this page and install
					it over your existing AT7ADAK installation. Do not uninstall the old version first unless we
					specifically tell you to — that creates unnecessary friction and can remove local app data.
					Updates signed with the same AT7ADAK key install over the existing app so you can keep using
					your account as usual.
				</p>
			</div>
		</section>

		<!-- 6. FAQ — answers stay in the HTML via <details> for crawlability -->
		<section class="container pb-12 md:pb-16">
			<h2 class="font-hero font-bold italic text-3xl sm:text-4xl md:text-5xl text-center mb-6 md:mb-8 px-1">
				Frequently Asked <span class="text-green">Questions</span>
			</h2>
			<div class="grid md:grid-cols-2 gap-3 md:gap-4 max-w-5xl mx-auto">
				{#each faqs as faq}
					<details class="border border-white/10 rounded-xl overflow-hidden bg-[#0c151e]/60 h-fit group">
						<summary
							class="w-full flex items-center justify-between gap-3 text-left px-4 sm:px-5 py-3.5 sm:py-4 font-medium hover:bg-white/5 trans cursor-pointer list-none"
						>
							<span class="text-sm md:text-[15px] leading-snug">{faq.q}</span>
							<span class="text-green shrink-0 group-open:rotate-180 trans">
								<Icon name="mdi:chevron-down" size={22} />
							</span>
						</summary>
						<div
							class="px-4 sm:px-5 pb-4 text-sm text-white/65 leading-relaxed border-t border-white/10 pt-3"
						>
							{faq.a}
						</div>
					</details>
				{/each}
			</div>
		</section>

		<!-- 7. Footer -->
		<FrontFooter />
	</div>
</div>
