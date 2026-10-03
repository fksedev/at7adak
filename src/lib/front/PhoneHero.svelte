<script lang="ts">
	import { cn } from '$lib/front'

	/**
	 * Clean device frame for real AT7ADAK screenshots (home / match).
	 * Thin black bezel + dynamic island — no skewed 3D frame.
	 */
	let {
		src = '/assets/home.jpeg',
		alt = 'AT7ADAK app',
		className = '',
		imgClass = ''
	}: {
		src?: string
		alt?: string
		className?: string
		imgClass?: string
	} = $props()
</script>

<div class={cn('relative mx-auto w-fit max-w-full', className)}>
	<div
		class={cn(
			'relative w-[11.5rem] sm:w-[13.5rem] lg:w-[15rem] overflow-hidden rounded-[1.7rem] sm:rounded-[1.9rem] lg:rounded-[2.1rem] border-[3px] border-[#1f1f22] bg-black',
			'shadow-[0_20px_55px_rgba(0,0,0,0.6)] ring-1 ring-white/12',
			imgClass
		)}
	>
		<img {src} {alt} class="block h-auto w-full select-none" draggable="false" />

		<!-- Dynamic Island -->
		<div
			class="pointer-events-none absolute left-1/2 top-[0.55rem] z-10 h-[1.05rem] w-[5.4rem] -translate-x-1/2 rounded-full bg-black sm:top-[0.62rem] sm:h-[1.12rem] sm:w-[5.9rem]"
			aria-hidden="true"
		></div>

		<!-- Subtle top edge highlight -->
		<div
			class="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-white/15"
			aria-hidden="true"
		></div>
	</div>
</div>
