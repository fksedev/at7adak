<script lang="ts">
    import type { HTMLInputTypeAttribute, HTMLInputAttributes, HTMLTextareaAttributes } from "svelte/elements"
    import { LoadingDots, cn } from "$lib/app"
    let {
        label = '', 
        loading = false,
        smallLabel = false, 
        type = 'text', 
        value = $bindable(),
        className = '',
        ...props
    }: HTMLInputAttributes & HTMLTextareaAttributes & {
        label?: string;
        loading?: boolean;
        smallLabel?: boolean;
        type?: HTMLInputTypeAttribute  | 'textarea';
        className?: string;
    } = $props()
</script>

<div>
    {#if label}
        <div class="tracking-normal text-base">
            <div 
                class="ml-3" 
                class:font-semibold={!smallLabel}
                class:text-sm={smallLabel}
            >
                {label}
            </div>
        </div> 
    {/if}
    <div 
        class={cn("relative border border-gray-700 rounded-xl px-3 py-2 bg-transparent mt-1", className)}
    >
        {#if type === 'textarea'}
            <textarea 
                bind:value
                {...props}
                class="w-full appearance-none bg-transparent focus:outline-none"
                rows="3"
            ></textarea>
        {:else}
            <input 
                bind:value
                type={type}
                {...props}
                class="w-full appearance-none bg-transparent focus:outline-none"
                class:pr-6={loading}
            />
        {/if}

        {#if loading}
            <div class="absolute right-2 top-1">
                <LoadingDots />
            </div>
        {/if}
    </div>
</div>
