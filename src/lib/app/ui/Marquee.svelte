<script lang="ts">
    // https://svelte-marquee.vercel.app/
	import { cn } from '$lib/app';
    import type { Snippet } from 'svelte'

    let {
        vertical = false,
        pauseOnHover = false,
        reverse = false,
        fade = false,
        className = '',
        numberOfCopies = 2,
        gap = '1rem',
        duration ='40s',
        children,
    }: {
        vertical?: boolean;
        pauseOnHover?: boolean;
        reverse?: boolean;
        fade?: boolean;
        className?: string;
        numberOfCopies?: number;
        gap?: string;
        duration?: string;
        children: Snippet;
    } = $props()
</script>

<div
	class={cn(`group flex gap-[var(--gap)] overflow-hidden [direction:ltr]`, className, {
		'flex-row': !vertical,
		'flex-col': vertical,
	}
	)}
    style:--gap={gap}
    style:--duration={duration}
	style={`mask-image: ${
		fade
			? `linear-gradient(${
					vertical ? 'to bottom' : 'to right'
				}, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
			: 'none'
	};
	  -webkit-mask-image: ${
			fade
				? `linear-gradient(${
						vertical ? 'to bottom' : 'to right'
					}, transparent 0%, rgba(0, 0, 0, 1.0) 10%, rgba(0, 0, 0, 1.0) 90%, transparent 100%)`
				: 'none'
		};
	  `}
>
	{#each Array(numberOfCopies).fill(0) as _, i (i)}
		<div
			class={cn(
				'flex justify-around gap-[var(--gap)] shrink-0', {
                    "animate-marquee-left flex-row": !vertical,
                    "animate-marquee-vertical flex-col": vertical,
                    "group-hover:![animation-play-state:paused]": pauseOnHover,
                    "![animation-direction:reverse]": reverse,
                }
			)}
		>
			{@render children?.()}
		</div>
	{/each}
</div>

<style>
    @keyframes marquee-left {
        from { transform: translateX(0); }
        to { transform: translateX(calc(-100% - var(--gap))); }
    }
    @keyframes marquee-up {
        from { transform: translateY(0); }
        to { transform: translateY(calc(-100% - var(--gap))); }
    }
    .animate-marquee-left {
        animation: marquee-left var(--duration, 40s) linear infinite;
    }
    .animate-marquee-up {
        animation: marquee-up var(--duration, 40s) linear infinite;
    }
</style>
