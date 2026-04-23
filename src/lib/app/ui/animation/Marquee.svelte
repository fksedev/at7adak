<script lang="ts">
    import { cn } from "$lib/app"
    import type { Snippet } from "svelte"
    let {
        pauseOnHover = false,
        vertical = false,
        repeat = 4,
        reverse = false,
        className = '',
        children,
    }: {
        pauseOnHover?: boolean;
        vertical?: boolean;
        repeat?: number;
        reverse?: boolean;
        className?: string;
        children?: Snippet;
    } = $props()
</script>

<div
    class={cn(
        "group flex overflow-hidden p-2 [--duration:2s] [--gap:1rem] gap-[--gap]",
        {
            "flex-row": !vertical,
            "flex-col": vertical,
        },
        className
    )}
>
    {#each { length: repeat } as _, i (i)}
        <div
            class={cn("flex shrink-0 justify-around gap-[--gap]", {
                "animate-marquee flex-row": !vertical,
                "animate-marquee-vertical flex-col": vertical,
                "group-hover:[animation-play-state:paused]": pauseOnHover,
                "[animation-direction:reverse]": reverse,
            })}
        >
            {@render children?.()}
        </div>
    {/each}
</div>
