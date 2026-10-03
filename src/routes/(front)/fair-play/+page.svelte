<script lang="ts">
	import { FrontHeader, FrontFooter, SeoSite, content, Icon } from '$lib/front'
</script>

<SeoSite
	title="Fair Play – AT7ADAK"
	description="How the AT7ADAK Fair Play Score works: start at 100, play fair, recover with clean matches, and penalties only after confirmed review."
/>

<div class="relative min-h-screen overflow-x-hidden">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-[min(55vh,480px)] bg-[url('/assets/hero-bg.webp')] bg-cover bg-center opacity-40"
	></div>
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black via-black/70 to-transparent"
	></div>

	<div class="relative">
		<FrontHeader />

		<article class="container max-w-3xl py-10 md:py-16 space-y-10">
			<header class="space-y-4 text-center">
				<h1 class="font-hero font-bold italic text-4xl sm:text-5xl md:text-6xl leading-none">
					FAIR PLAY — <span class="text-green">HOW IT WORKS</span>
				</h1>
				<p class="font-hero font-bold italic text-2xl sm:text-3xl text-white/90">
					Your Reputation Matters
				</p>
				<p class="text-white/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
					Every AT7ADAK player starts with a Fair Play Score of 100/100. Your score reflects your
					behavior and reliability when competing on AT7ADAK.
				</p>
				<p class="text-xs text-white/45">{content.operator}</p>
			</header>

			<div class="grid gap-4">
				{#each [
					{
						icon: 'solar:shield-check-bold',
						title: 'Start at 100',
						body: 'Every new player begins with a Fair Play Score of 100/100.'
					},
					{
						icon: 'ion:game-controller',
						title: 'Play Fair',
						body: 'Complete matches properly, submit accurate results, respond when required, and provide genuine evidence if a dispute occurs.'
					},
					{
						icon: 'mdi:trending-up',
						title: 'Build Your Reputation',
						body: 'Clean completed matches help maintain and recover your Fair Play Score. Your score can recover by +1 for each clean completed match, up to 100.'
					},
					{
						icon: 'mdi:scale-balance',
						title: 'Disputes Are Reviewed',
						body: 'Opening a dispute does not automatically hurt anyone’s score. Penalties are applied only after an issue is confirmed through admin review or confirmed system abuse.'
					},
					{
						icon: 'mdi:cancel',
						title: 'Abuse Has Consequences',
						body: 'Confirmed fake results, fake evidence, valid disputes, repeated violations, warnings or account penalties can reduce your Fair Play Score.'
					}
				] as item}
					<section
						class="rounded-2xl border border-white/10 bg-[#0c151e]/90 p-5 sm:p-6 flex gap-4 items-start"
					>
						<div class="text-green shrink-0 mt-0.5">
							<Icon name={item.icon} size={28} />
						</div>
						<div class="space-y-1.5">
							<h2 class="font-hero font-bold italic text-xl sm:text-2xl text-white leading-none">
								{item.title}
							</h2>
							<p class="text-sm sm:text-[15px] text-white/70 leading-relaxed">{item.body}</p>
						</div>
					</section>
				{/each}
			</div>

			<section
				class="rounded-2xl border border-green/35 bg-green/10 p-6 sm:p-8 text-center space-y-3"
			>
				<p class="font-hero font-bold italic text-2xl sm:text-3xl text-green leading-tight">
					PLAY FAIR. BUILD YOUR REPUTATION. EARN TRUST.
				</p>
				<p class="text-sm sm:text-base text-white/75 leading-relaxed max-w-2xl mx-auto">
					Your Fair Play Score follows your activity on AT7ADAK. Respect the rules, report results
					accurately, and keep your reputation strong.
				</p>
				<p class="text-xs text-white/45 pt-1">
					See also our
					<a href="/terms" class="text-green underline underline-offset-2">Terms &amp; Conditions</a>
					· Questions:
					<a
						href="mailto:{content.supportEmail}"
						class="text-green underline underline-offset-2">{content.supportEmail}</a
					>
				</p>
			</section>
		</article>

		<FrontFooter />
	</div>
</div>
