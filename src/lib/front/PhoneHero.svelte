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

<!-- Outer wrapper absorbs skew overflow so neighbors don't collide -->
<div class={cn('relative mx-auto w-fit max-w-full px-3 py-2', className)}>
	<div class="relative inline-block origin-center -skew-x-6">
		<img
			src="/assets/hero-iphone.png"
			alt=""
			aria-hidden="true"
			class={cn(
				'block h-auto w-[min(52vw,13.5rem)] sm:w-[min(48vw,15rem)] md:w-auto md:max-w-[17rem] select-none',
				imgClass
			)}
		/>

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
</div>
