<script lang="ts">
	import { FrontHeader, FrontFooter, SeoSite, content } from '$lib/front'

	const levels = [
		{
			tier: 'LEVEL 1',
			status: 'NEW',
			color: 'text-green',
			border: 'border-green/40',
			bg: 'bg-green/10',
			matches: 'Under 5',
			played: '—',
			entry: '$10',
			withdraw: 'Not available',
			blurb:
				'Every new player starts here. You can enter matches up to $10. Withdrawals are not available until you meet the requirements for Level 2.'
		},
		{
			tier: 'LEVEL 2',
			status: 'ACTIVE',
			color: 'text-sky-400',
			border: 'border-sky-400/40',
			bg: 'bg-sky-400/10',
			matches: '5+',
			played: '$30+',
			entry: '$20',
			withdraw: 'Up to $100/day',
			blurb:
				'Complete at least 5 matches and reach at least $30 in total played amount. You’ll unlock match entries up to $20 and withdrawals of up to $100 per day.'
		},
		{
			tier: 'LEVEL 3',
			status: 'TRUSTED',
			color: 'text-violet-300',
			border: 'border-violet-300/40',
			bg: 'bg-violet-300/10',
			matches: '15+',
			played: '$100+',
			entry: '$100',
			withdraw: 'Up to $300/day',
			blurb:
				'Complete at least 15 matches and reach at least $100 in total played amount. You’ll unlock match entries up to $100 and withdrawals of up to $300 per day.'
		}
	]
</script>

<SeoSite
	title="Player Levels & Withdrawals – AT7ADAK"
	description="AT7ADAK player levels: unlock higher match entry and withdrawal limits as you complete matches and build your play history."
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

		<article class="container max-w-4xl py-10 md:py-16 space-y-10">
			<header class="space-y-4 text-center">
				<h1 class="font-hero font-bold italic text-4xl sm:text-5xl md:text-6xl leading-none">
					PLAYER <span class="text-green">LEVELS</span>
				</h1>
				<p class="font-hero font-bold italic text-xl sm:text-2xl text-white/90">
					Play more. Build your history. Unlock higher limits.
				</p>
				<p class="text-white/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
					AT7ADAK uses a player level system to gradually unlock higher match entry and withdrawal
					limits as players build activity on the platform.
				</p>
				<p class="text-xs text-white/45">{content.operator}</p>
			</header>

			<!-- Comparison table -->
			<section class="overflow-x-auto rounded-2xl border border-white/10 bg-[#0c151e]/90">
				<table class="w-full min-w-[640px] text-sm text-left">
					<thead>
						<tr class="border-b border-white/10 text-white/50">
							<th class="px-4 py-3 font-medium"> </th>
							{#each levels as level}
								<th class="px-4 py-3 font-hero font-bold italic text-base {level.color}">
									{level.tier}
									<div class="text-xs font-sans font-normal text-white/45 mt-0.5">{level.status}</div>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody class="text-white/75">
						<tr class="border-b border-white/5">
							<td class="px-4 py-3 text-white/50">Matches Played</td>
							{#each levels as level}
								<td class="px-4 py-3 font-medium">{level.matches}</td>
							{/each}
						</tr>
						<tr class="border-b border-white/5">
							<td class="px-4 py-3 text-white/50">Total Played Amount</td>
							{#each levels as level}
								<td class="px-4 py-3 font-medium">{level.played}</td>
							{/each}
						</tr>
						<tr class="border-b border-white/5">
							<td class="px-4 py-3 text-white/50">Maximum Entry</td>
							{#each levels as level}
								<td class="px-4 py-3 font-medium">{level.entry}</td>
							{/each}
						</tr>
						<tr>
							<td class="px-4 py-3 text-white/50">Withdrawal Limit</td>
							{#each levels as level}
								<td class="px-4 py-3 font-medium">{level.withdraw}</td>
							{/each}
						</tr>
					</tbody>
				</table>
			</section>

			<section class="space-y-4">
				<h2 class="font-hero font-bold italic text-2xl sm:text-3xl text-center">
					How do I <span class="text-green">level up?</span>
				</h2>
				<div class="grid gap-4">
					{#each levels as level}
						<div class="rounded-2xl border {level.border} {level.bg} p-5 sm:p-6 space-y-2">
							<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
								<h3 class="font-hero font-bold italic text-xl sm:text-2xl {level.color}">
									{level.tier}
								</h3>
								<span class="text-sm text-white/55">— {level.status}</span>
							</div>
							<p class="text-sm sm:text-[15px] text-white/75 leading-relaxed">{level.blurb}</p>
						</div>
					{/each}
				</div>
			</section>

			<section
				class="rounded-2xl border border-green/35 bg-green/10 p-6 sm:p-8 text-center space-y-3"
			>
				<p class="font-hero font-bold italic text-2xl sm:text-3xl text-green leading-tight">
					BUILD YOUR LEVEL. UNLOCK HIGHER LIMITS.
				</p>
				<p class="text-sm sm:text-base text-white/75 leading-relaxed max-w-2xl mx-auto">
					Your level is based on your completed match activity and total played amount on AT7ADAK.
				</p>
				<p class="text-xs text-white/45 pt-1">
					See also
					<a href="/terms" class="text-green underline underline-offset-2">Terms &amp; Conditions</a>
					·
					<a href="/fair-play" class="text-green underline underline-offset-2">Fair Play</a>
					·
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
