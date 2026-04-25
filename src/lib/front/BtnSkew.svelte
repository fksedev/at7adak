<script lang="ts">
    import { Icon, cn } from "$lib/app"
    import type { Snippet } from "svelte"

    let {
        icon,
        children,
        onclick,
        className,
    }: {
        icon?: string,
        children: Snippet,
        onclick?: () => void,
        className?: string,
    } = $props()
</script>

<button 
    class={cn("bg-green text-black -skew-x-12 px-8 py-2 rounded font-hero font-bold italic text-2xl trans hover:bg-green/80", className)}
    onclick={onclick}
>
    <div class="skew-x-12 flex-center gap-2">
        {#if icon}
            <Icon name={icon} />
        {/if}
        {@render children?.()}
    </div>
</button>
