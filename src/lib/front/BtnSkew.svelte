<script lang="ts">
    import { Icon, cn } from "$lib/front"
    import type { Snippet } from "svelte"

    let {
        icon,
        children,
        onclick,
        className,
        href,
    }: {
        icon?: string,
        children: Snippet,
        onclick?: () => void,
        className?: string,
        href?: string,
    } = $props()

    const classes = $derived(cn(
        "bg-green text-black -skew-x-12 px-5 sm:px-8 py-2 rounded font-hero font-bold italic text-xl sm:text-2xl trans hover:bg-green/80 inline-flex max-w-full",
        className
    ))
</script>

{#if href}
    <a {href} class={classes}>
        <div class="skew-x-12 flex-center gap-2">
            {#if icon}
                <Icon name={icon} />
            {/if}
            {@render children?.()}
        </div>
    </a>
{:else}
    <button class={classes} {onclick}>
        <div class="skew-x-12 flex-center gap-2">
            {#if icon}
                <Icon name={icon} />
            {/if}
            {@render children?.()}
        </div>
    </button>
{/if}
