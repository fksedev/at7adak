<script lang="ts">
	import { Logo, Socials, cn } from '$lib/front'

	let {
		active = '' as '' | 'home' | 'download' | 'how' | 'games' | 'support'
	} = $props()

	let open = $state(false)

	const linkClass = (id: string) =>
		cn(
			'block w-full text-base font-semibold py-3.5 px-4 rounded-lg trans',
			active === id
				? 'bg-green/15 text-green'
				: 'text-white/80 hover:bg-white/5 hover:text-green'
		)

	const desktopLink = (id: string) =>
		cn(
			'text-sm font-medium opacity-70 hover:opacity-100 hover:text-green trans whitespace-nowrap',
			active === id &&
				'opacity-100 text-green underline underline-offset-4 decoration-green decoration-2'
		)

	const close = () => (open = false)
</script>

<header class="container py-3 md:py-4 relative z-30">
	<div class="flex items-center justify-between gap-3">
		<a href="/" class="shrink-0 relative z-40" aria-label="AT7ADAK home" onclick={close}>
			<Logo className="h-12 sm:h-14 md:h-16 lg:h-20" />
		</a>

		<nav class="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Primary">
			<a href="/" class={desktopLink('home')}>Home</a>
			<a href="/how-it-works" class={desktopLink('how')}>How It Works</a>
			<a href="/#games" class={desktopLink('games')}>Games</a>
			<a href="/contact" class={desktopLink('support')}>Support</a>
		</nav>

		<a
			href="/download"
			class="hidden md:inline-flex shrink-0 items-center justify-center rounded-full bg-green px-5 py-2.5 text-sm font-bold text-black hover:bg-green/90 trans"
		>
			Download App
		</a>

		<!-- Mobile: socials + menu -->
		<div class="md:hidden relative z-40 flex items-center gap-2 shrink-0">
			<Socials compact size={18} className="max-[380px]:gap-1" />
			<button
				type="button"
				class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-green bg-black text-green"
				aria-label={open ? 'Close menu' : 'Open menu'}
				aria-expanded={open}
				aria-controls="mobile-nav"
				onclick={() => (open = !open)}
			>
				{#if open}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M6 6l12 12M18 6L6 18"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
						/>
					</svg>
				{:else}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M4 7h16M4 12h16M4 17h16"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</div>

	{#if open}
		<button
			type="button"
			class="md:hidden fixed inset-0 z-20 bg-black/70"
			aria-label="Close menu"
			onclick={close}
		></button>

		<nav
			id="mobile-nav"
			class="md:hidden absolute left-4 right-4 top-full z-30 mt-2 rounded-2xl border border-green/40 bg-[#0a0e12] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
			aria-label="Mobile"
		>
			<a href="/" class={linkClass('home')} onclick={close}>Home</a>
			<a href="/how-it-works" class={linkClass('how')} onclick={close}>How It Works</a>
			<a href="/#games" class={linkClass('games')} onclick={close}>Games</a>
			<a href="/contact" class={linkClass('support')} onclick={close}>Support</a>
			<a href="/download" class={linkClass('download')} onclick={close}>Download</a>
			<a href="/fair-play" class={linkClass('')} onclick={close}>Fair Play</a>
			<a href="/withdrawal-limits" class={linkClass('')} onclick={close}>Withdrawal Limits</a>
		</nav>
	{/if}
</header>
