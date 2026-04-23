<script lang="ts">
    import { cn } from "$lib/app"
    import type { Snippet } from "svelte"

    let {
        shimmerWidth = 100,
        className = "",
        children,
    }: {
        shimmerWidth?: number
        className?: string
        children?: Snippet
    } = $props()
</script>

<p
    style:--shimmer-width="{shimmerWidth}px"
    class={cn(
        "max-w-md text-neutral-600/50 dark:text-neutral-400/50 ",

        // Shimmer effect
        "animate-shimmer bg-clip-text bg-no-repeat bg-position-[0_0] bg-size-[var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",

        // Shimmer gradient
        "bg-linear-to-r from-transparent via-black/80 via-50% to-transparent  dark:via-white/80",

        className
    )}
>
    {@render children?.()}
</p>

<style>
    .animate-shimmer {
        animation: shimmer 8s infinite;
    }
    @keyframes shimmer {
        0%, 90%, 100% {
            background-position: calc(-100% - var(--shimmer-width)) 0;
        }
        30%, 60% {
            background-position: calc(100% + var(--shimmer-width)) 0;
        }
    }
</style>
