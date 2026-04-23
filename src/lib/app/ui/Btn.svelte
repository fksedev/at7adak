<script lang="ts">
    import { cn, Icon, LoadingDots } from "$lib/app"
    import type { HTMLButtonAttributes } from "svelte/elements"

    let {
        id,
        title, 
        className = '', 
        loading = false,
        disabled = false,
        dropIcon = false,
        ...props
    }: HTMLButtonAttributes & {
        id?: string;
        title: string;
        loading?: boolean;
        disabled?: boolean;
        dropIcon?: boolean;
        className?: string;
    } = $props()
</script>

<button {id}
    class={cn("relative px-4 py-2 rounded-full border border-gray-700 text-blue text-base font-medium enabled:hover:border-pink transition-all duration-500 cursor-pointer disabled:pointer-events-none disabled:cursor-default disabled:opacity-40", className)}
    disabled={loading || disabled}
    {...props}
>
    <div class="flex-center gap-3">
        {#if loading}
            <LoadingDots />
        {/if}
        <div>
            {@html title}
        </div>
        {#if dropIcon}
            <div class="w-0.5"></div>
        {/if}
    </div>

    {#if dropIcon}
        <div class="absolute right-2 top-1/2 -translate-y-1/2">
            <Icon name={'solar:alt-arrow-down-outline'} size={14} />
        </div>
    {/if}
</button>
