<script lang="ts">
	import { PhoneHero, cn } from '$lib/front'

	/** Mockup stack: Home large in front-left, Create Match behind-right. */
	let { className = '' }: { className?: string } = $props()
</script>

<div
	class={cn(
		'relative mx-auto w-full max-w-[21rem] sm:max-w-[26rem] lg:max-w-[32rem] h-[26rem] sm:h-[30rem] lg:h-[34rem]',
		className
	)}
>
	<!-- Green atmospheric glow -->
	<div
		class="pointer-events-none absolute left-1/2 top-[48%] z-0 h-[75%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(198,223,40,0.32)_0%,rgba(198,223,40,0.1)_40%,transparent_70%)] blur-2xl"
		aria-hidden="true"
	></div>

	<!-- Lit rocky ground -->
	<div
		class="pointer-events-none absolute inset-x-[6%] bottom-1 z-0 h-16 sm:h-20 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(198,223,40,0.28)_0%,rgba(12,12,12,0.9)_50%,transparent_75%)] blur-md"
		aria-hidden="true"
	></div>

	<!-- Back: Create Match -->
	<div
		class="absolute right-0 sm:right-2 top-6 sm:top-8 z-[1] origin-bottom rotate-[8deg] scale-[0.9]"
	>
		<PhoneHero
			src="/assets/match.jpeg"
			alt="AT7ADAK Create Match"
			imgClass="!w-[10.25rem] sm:!w-[12rem] lg:!w-[13.25rem]"
		/>
	</div>

	<!-- Front: Home -->
	<div
		class="absolute left-0 sm:left-1 top-0 z-10 origin-bottom -rotate-[6deg] drop-shadow-[0_28px_55px_rgba(0,0,0,0.7)]"
	>
		<PhoneHero
			src="/assets/home.jpeg"
			alt="AT7ADAK Home"
			imgClass="!w-[12rem] sm:!w-[14rem] lg:!w-[15.75rem]"
		/>
	</div>
</div>
