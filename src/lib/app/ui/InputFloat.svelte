<!-- @wc-ignore-file -->
<script lang="ts">
    // @wc-ignore-file
    import { cn, uuid } from "$lib/app"
    import type { HTMLInputAttributes, HTMLInputTypeAttribute, HTMLTextareaAttributes } from "svelte/elements"

    let {
        value = $bindable(''),
        name = "",
        label = "",
        id = uuid(),
        type = 'text',
        append = "",
        hint = "",
        error = "",
        className = "",
        containerClass = "",
        rtl = false,
        ...props
    }: HTMLInputAttributes & HTMLTextareaAttributes & {
        value: string,
        name?: string,
        label?: string,
        id?: string,
        type?: HTMLInputTypeAttribute | 'textarea',
        append?: string,
        hint?: string,
        error?: string,
        className?: string,
        containerClass?: string,
        rtl?: boolean,
    } = $props()

    const setType:any = node => node.type = type

</script>

<div>
    <div class={cn("relative text-dark space-y-0.5", containerClass)}>
        {#if type === 'textarea'}
            <textarea
                class={cn(
                    "INPUT py-4 px-3 h-28 appearance-none border border-dark/30 bg-white rounded block text-base w-full transition-all bg-clip-padding focus:outline-0 placeholder-transparent arrow-hide",
                    className,
                )}
                class:border-red={error}
                {id}
                {name}
                placeholder={label}
                bind:value
                {...props}
            ></textarea>
        {:else}
            <input use:setType 
                class={cn(
                    "INPUT py-4 px-3 h-14.5 appearance-none border border-dark/30 bg-white! rounded block text-base w-full transition-all bg-clip-padding focus:outline-0 placeholder-transparent arrow-hide",
                    className,
                )}
                class:border-red={error}
                {id}
                {name}
                placeholder={label}
                bind:value
                {...props}
            />
        {/if}
        <label for={id}
            class={cn(
                "inline-block border border-transparent py-4 px-3 h-full w-full absolute left-0 top-0 overflow-hidden pointer-events-none text-ellipsis whitespace-nowrap transition-all text-base",
                rtl ? 'origin-top-right' : 'origin-top-left'
            )}
        >
            {label}
        </label>
        {#if append}
            <div class={cn(
                "opacity-50 text-xs absolute top-1/2 -translate-y-1/2",
                rtl ? 'left-4': 'right-4'
            )}>{append}</div>
        {/if}
    </div>
    {#if hint}
        <div class="text-xs opacity-65">{hint}</div>
    {/if}
    {#if error}
        <div class="text-xs text-red">{error}</div>
    {/if}
</div>

<style>
    .INPUT:focus, .INPUT:not(:placeholder-shown) {
        padding-top: 26px;
        padding-bottom: 10px;
    }
    .INPUT:focus~label, .INPUT:not(:placeholder-shown)~label {
        opacity: .75;
        transform: scale(.85) translateY(-.5rem) translateX(.15rem);
    }
</style>
