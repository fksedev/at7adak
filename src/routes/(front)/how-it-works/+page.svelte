<script lang="ts">
	import { Download, FrontHeader, FrontFooter, SeoSite, Icon } from '$lib/front'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()

	const steps = [
		{
			n: 1,
			title: 'CREATE YOUR ACCOUNT',
			desc: 'Download AT7ADAK, create your profile, choose your games and get ready to compete.',
			ui: 'account' as const
		},
		{
			n: 2,
			title: 'ADD BALANCE',
			desc: 'Add funds securely to your AT7ADAK Balance using the available payment methods.',
			ui: 'wallet' as const
		},
		{
			n: 3,
			title: 'FIND YOUR CHALLENGE',
			desc: 'Choose your game and either create a challenge, join an available match, or enter a tournament.',
			ui: 'games' as const
		},
		{
			n: 4,
			title: 'PLAY THE MATCH',
			desc: 'Connect with your opponent and play using the match settings and rules shown in AT7ADAK.',
			ui: 'room' as const
		},
		{
			n: 5,
			title: 'SUBMIT THE RESULT',
			desc: 'When the match is finished, submit your result and any required proof. If there is a disagreement, our dispute system allows the result to be reviewed.',
			ui: 'result' as const
		},
		{
			n: 6,
			title: 'RECEIVE YOUR PRIZE',
			desc: 'Once the result is confirmed, the applicable prize is credited to your AT7ADAK Balance.',
			ui: 'prize' as const
		},
		{
			n: 7,
			title: 'WITHDRAW',
			desc: 'Eligible available balance can be withdrawn using the supported withdrawal methods.',
			ui: 'withdraw' as const
		}
	]
</script>

<SeoSite
	title="How AT7ADAK Works – From Download to Rewards"
	description="Learn how AT7ADAK works in seven simple steps: create an account, add balance, find a challenge, play, submit results, win prizes, and withdraw."
/>

<div class="relative min-h-screen overflow-x-hidden">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-[min(70vh,640px)] bg-[url('/assets/hero-bg.webp')] bg-cover bg-center opacity-45"
	></div>
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black via-black/75 to-transparent"
	></div>
	<div
		class="pointer-events-none absolute inset-x-0 top-[45vh] h-40 bg-linear-to-b from-transparent to-black"
	></div>

	<div class="relative">
		<FrontHeader active="how" />

		<section class="container pt-6 pb-8 md:pt-14 md:pb-16 text-center">
			<h1 class="font-hero font-bold italic text-4xl sm:text-5xl md:text-7xl leading-none">
				HOW IT <span class="text-green">WORKS</span>
			</h1>
			<p class="mt-4 text-white/75 text-sm sm:text-base md:text-lg max-w-xl mx-auto px-1">
				From download to real rewards — in just a few simple steps.
			</p>
		</section>

		<section class="container pb-10 md:pb-16">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-4">
				{#each steps.slice(0, 4) as step, i}
					<div class="relative">
						{#if i < 3}
							<div
								class="hidden lg:flex absolute -right-3 top-1/3 z-20 text-green opacity-80"
								aria-hidden="true"
							>
								<Icon name="mdi:chevron-double-right" size={28} />
							</div>
						{/if}
						{@render StepCard({ step })}
					</div>
				{/each}
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-4 mt-4 sm:mt-5 lg:mt-8 max-w-5xl mx-auto">
				{#each steps.slice(4) as step, i}
					<div class="relative">
						{#if i < 2}
							<div
								class="hidden lg:flex absolute -right-3 top-1/3 z-20 text-green opacity-80"
								aria-hidden="true"
							>
								<Icon name="mdi:chevron-double-right" size={28} />
							</div>
						{/if}
						{@render StepCard({ step })}
					</div>
				{/each}
			</div>
		</section>

		<section class="container pb-14">
			<div
				class="rounded-2xl border border-red/35 bg-red/10 p-6 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
			>
				<div class="space-y-2 text-center lg:text-left">
					<div class="font-hero font-bold italic text-3xl md:text-4xl leading-none">
						READY FOR THE <span class="text-green">CHALLENGE?</span>
					</div>
					<p class="text-white/75">Download AT7ADAK now and start playing.</p>
				</div>
				<div class="shrink-0">
					<Download size="lg" className="py-0 px-0" apk={data.apk} />
					<div class="text-center mt-2">
						<a href="/download" class="text-sm text-green hover:underline underline-offset-4">
							Full download & install guide →
						</a>
					</div>
				</div>
			</div>
		</section>

		<FrontFooter />
	</div>
</div>

{#snippet StepCard({ step }: { step: (typeof steps)[number] })}
	<article
		class="h-full border border-white/10 rounded-2xl bg-[#0c151e]/85 p-4 md:p-5 flex flex-col gap-3 hover:border-green/35 trans"
	>
		<div class="flex items-center gap-2.5">
			<div
				class="size-8 rounded-full bg-green text-black font-hero font-bold italic text-xl flex-center shrink-0 shadow-[0_0_18px_rgba(198,223,40,0.35)]"
			>
				{step.n}
			</div>
			<h3 class="font-hero font-bold italic text-base sm:text-lg md:text-xl leading-tight text-white">
				{step.title}
			</h3>
		</div>

		<div class="flex-center py-1">
			{#if step.ui === 'account'}
				<div
					class="mx-auto w-[148px] h-[280px] rounded-[1.35rem] border-2 border-white/20 bg-black overflow-hidden relative shadow-xl"
				>
					<div class="absolute top-0 inset-x-0 h-5 flex-center z-10">
						<div class="w-12 h-1 rounded-full bg-white/20"></div>
					</div>
					<div
						class="h-full pt-7 px-3 pb-3 flex flex-col items-center justify-center gap-3 bg-linear-to-b from-[#101820] to-black"
					>
						<img src="/logo-trans.png" alt="" class="h-12 object-contain" />
						<div class="font-hero font-bold italic text-sm text-center leading-none">
							Play. <span class="text-green">Compete</span>. Win.
						</div>
						<div class="w-full mt-2 bg-green text-black text-xs font-bold py-2 rounded-md text-center">
							Create Account
						</div>
						<div class="w-full border border-white/25 text-white/80 text-xs py-2 rounded-md text-center">
							Login
						</div>
					</div>
				</div>
			{:else if step.ui === 'wallet'}
				<div
					class="mx-auto w-[148px] h-[280px] rounded-[1.35rem] border-2 border-white/20 bg-black overflow-hidden relative shadow-xl"
				>
					<div class="absolute top-0 inset-x-0 h-5 flex-center z-10">
						<div class="w-12 h-1 rounded-full bg-white/20"></div>
					</div>
					<div class="h-full pt-7 px-3 pb-3 flex flex-col gap-2 bg-linear-to-b from-[#101820] to-black">
						<div class="text-[10px] text-white/50">Wallet</div>
						<div class="text-xs text-white/60">Your Balance</div>
						<div class="font-hero font-bold italic text-3xl text-green leading-none">$25.00</div>
						<div class="w-full mt-2 bg-green text-black text-xs font-bold py-2 rounded-md text-center">
							+ Add Funds
						</div>
						<div
							class="mt-auto border border-white/10 rounded-lg p-2 text-[10px] text-white/55 flex-between"
						>
							<span>Whish Money</span>
							<span class="text-green">●</span>
						</div>
					</div>
				</div>
			{:else if step.ui === 'games'}
				<div
					class="mx-auto w-[148px] h-[280px] rounded-[1.35rem] border-2 border-white/20 bg-black overflow-hidden relative shadow-xl"
				>
					<div class="absolute top-0 inset-x-0 h-5 flex-center z-10">
						<div class="w-12 h-1 rounded-full bg-white/20"></div>
					</div>
					<div class="h-full pt-7 px-2.5 pb-3 flex flex-col gap-1.5 bg-linear-to-b from-[#101820] to-black">
						<div class="text-[10px] text-white/50 px-1 mb-1">Choose Game</div>
						{#each ['PUBG Mobile', 'FC 26 / FC Mobile', 'Dota 2', 'CS2'] as game}
							<div
								class="rounded-md border border-white/10 bg-white/5 px-2 py-2 text-[10px] flex-between"
							>
								<span>{game}</span>
								<span class="text-green"><Icon name="mdi:chevron-right" size={14} /></span>
							</div>
						{/each}
					</div>
				</div>
			{:else if step.ui === 'room'}
				<div
					class="mx-auto w-[148px] h-[280px] rounded-[1.35rem] border-2 border-white/20 bg-black overflow-hidden relative shadow-xl"
				>
					<div class="absolute top-0 inset-x-0 h-5 flex-center z-10">
						<div class="w-12 h-1 rounded-full bg-white/20"></div>
					</div>
					<div class="h-full pt-7 px-3 pb-3 flex flex-col gap-2 bg-linear-to-b from-[#101820] to-black">
						<div class="text-[10px] text-white/50">Match Room</div>
						<div class="border border-white/10 rounded-lg p-2 space-y-1.5 text-[10px]">
							<div class="flex-between">
								<span class="text-white/50">Room ID</span><span>1234567</span>
							</div>
							<div class="flex-between">
								<span class="text-white/50">Password</span><span>a7b3c</span>
							</div>
						</div>
						<div
							class="w-full mt-auto bg-green text-black text-xs font-bold py-2 rounded-md text-center"
						>
							Open Game
						</div>
					</div>
				</div>
			{:else if step.ui === 'result'}
				<div
					class="mx-auto w-[148px] h-[280px] rounded-[1.35rem] border-2 border-white/20 bg-black overflow-hidden relative shadow-xl"
				>
					<div class="absolute top-0 inset-x-0 h-5 flex-center z-10">
						<div class="w-12 h-1 rounded-full bg-white/20"></div>
					</div>
					<div class="h-full pt-7 px-3 pb-3 flex flex-col gap-2 bg-linear-to-b from-[#101820] to-black">
						<div class="text-[10px] text-white/50">Match Result</div>
						<div class="font-hero font-bold italic text-3xl text-center py-3">
							<span class="text-green">2</span>
							<span class="text-white/40 mx-1">-</span>
							<span>0</span>
						</div>
						<div class="text-[10px] text-center text-white/45 -mt-2 mb-2">You · Opponent</div>
						<div class="w-full bg-green text-black text-xs font-bold py-2 rounded-md text-center">
							Submit Result
						</div>
						<div
							class="w-full border border-white/20 text-white/70 text-[10px] py-2 rounded-md text-center"
						>
							Upload Proof
						</div>
					</div>
				</div>
			{:else if step.ui === 'prize'}
				<div
					class="mx-auto w-[148px] h-[280px] rounded-[1.35rem] border-2 border-white/20 bg-black overflow-hidden relative shadow-xl"
				>
					<div class="absolute top-0 inset-x-0 h-5 flex-center z-10">
						<div class="w-12 h-1 rounded-full bg-white/20"></div>
					</div>
					<div
						class="h-full pt-7 px-3 pb-3 flex flex-col items-center justify-center gap-2 bg-linear-to-b from-[#101820] to-black"
					>
						<div class="text-green"><Icon name="solar:cup-star-bold" size={48} /></div>
						<div class="font-hero font-bold italic text-xl text-center leading-none">You Won!</div>
						<div class="font-hero font-bold italic text-3xl text-green leading-none">$50.00</div>
						<div
							class="w-full mt-3 bg-green text-black text-xs font-bold py-2 rounded-md text-center"
						>
							View Balance
						</div>
					</div>
				</div>
			{:else}
				<div
					class="mx-auto w-[148px] h-[280px] rounded-[1.35rem] border-2 border-white/20 bg-black overflow-hidden relative shadow-xl"
				>
					<div class="absolute top-0 inset-x-0 h-5 flex-center z-10">
						<div class="w-12 h-1 rounded-full bg-white/20"></div>
					</div>
					<div class="h-full pt-7 px-3 pb-3 flex flex-col gap-2 bg-linear-to-b from-[#101820] to-black">
						<div class="text-[10px] text-white/50">Withdraw Funds</div>
						<div class="text-xs text-white/60">Available</div>
						<div class="font-hero font-bold italic text-3xl text-green leading-none">$120.00</div>
						<div
							class="border border-white/10 rounded-lg p-2 text-[10px] text-white/55 flex-between mt-1"
						>
							<span>Whish Money</span>
							<span class="text-green">●</span>
						</div>
						<div
							class="w-full mt-auto bg-green text-black text-xs font-bold py-2 rounded-md text-center"
						>
							Withdraw
						</div>
					</div>
				</div>
			{/if}
		</div>

		<p class="text-sm text-white/65 leading-relaxed mt-auto">{step.desc}</p>
	</article>
{/snippet}
