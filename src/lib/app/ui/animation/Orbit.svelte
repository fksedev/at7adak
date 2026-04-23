<script lang="ts">
	import { type Snippet } from 'svelte';
    import { cn } from "$lib/app"
    let {
        className = "",
        reverse = false,
        duration = 20,
        delay = 0,
        radius = 50,
        path = true,
        children,
    }: {
        className?: string;
        reverse?: boolean;
        duration?: number;
        delay?: number;
        radius?: number;
        path?: boolean;
        children?: Snippet;
    } = $props()
</script>

{#if path}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        class="pointer-events-none absolute inset-0 h-full w-full"
    >
        <circle
            class="stroke-1 stroke-gray-700"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
            stroke-dasharray="4 4"
        />
    </svg>
    <div
        style:--duration={duration}
        style:--radius={radius}
        style:animation-delay={`${delay*1000}ms`}
        class={cn(
            "absolute flex size-12 transform-gpu animate-orbit items-center justify-center rounded-full",
            { "[animation-direction:reverse]": reverse },
            className
        )}
    >
        {@render children?.()}
    </div>
{/if}

<style>
    .animate-orbit {
        animation: orbit calc(var(--duration)*1s) linear infinite;
    }

    @keyframes orbit {
        0% { transform: rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg); }
        100% { transform: rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg);}
    }
</style>
