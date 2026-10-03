<script lang="ts">
	import { PhoneHero, cn } from '$lib/front'

	/** Two-phone hero stack like the marketing mockup: Home in front, Create Match behind. */
	let { className = '' }: { className?: string } = $props()
</script>

<div class={cn('relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] md:max-w-[28rem] h-[22rem] sm:h-[26rem] md:h-[28rem]', className)}>
	<!-- Back phone: Create Match -->
	<div
		class="absolute right-0 top-4 sm:top-6 z-0 scale-[0.88] origin-top-right opacity-95 pointer-events-none"
	>
		<PhoneHero
			src="/assets/match.jpeg"
			alt="AT7ADAK Create Match"
			imgClass="!w-[9.5rem] sm:!w-[11rem] md:!w-[12.5rem]"
		/>
	</div>

	<!-- Front phone: Home -->
	<div class="absolute left-0 sm:left-2 top-0 z-10 drop-shadow-2xl">
		<PhoneHero
			src="/assets/home.jpeg"
			alt="AT7ADAK Home"
			imgClass="!w-[11rem] sm:!w-[13rem] md:!w-[14.5rem]"
		/>
	</div>
</div>
