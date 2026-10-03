<script lang="ts">
	import { cn } from '$lib/front'

	/**
	 * Hero phone: keeps the existing 3D bezel/lighting mockup and shows a
	 * real AT7ADAK screenshot in the screen area.
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

<div class={cn('relative inline-block -skew-x-6', className)}>
	<!-- Bezel + lighting only (fake screen covered by real screenshot) -->
	<img
		src="/assets/hero-iphone.png"
		alt=""
		aria-hidden="true"
		class={cn(
			'block w-[42vw] max-w-48 sm:max-w-56 md:w-auto md:max-w-none select-none',
			imgClass
		)}
	/>

	<!-- Live app screenshot fitted to the screen region -->
	<div
		class="pointer-events-none absolute overflow-hidden bg-black"
		style="
			left: 12.2%;
			top: 4.2%;
			width: 75.6%;
			height: 91.6%;
			border-radius: 12% / 6%;
		"
	>
		<img {src} {alt} class="absolute inset-0 h-full w-full object-cover object-top" />
	</div>
</div>
