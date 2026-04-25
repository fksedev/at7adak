<script lang="ts">
    import { Icon, LoadingDots, cn } from "$lib/dashboard"
    import type { HTMLInputTypeAttribute, HTMLInputAttributes, HTMLTextareaAttributes } from "svelte/elements"
    let {
        label = '', 
        placeholder = '', 
        help = '', 
        loading = false,
        smallLabel = false, 
        search = false, 
        clearable = false, 
        type = 'text', 
        value = $bindable(),
        className = '',
        ...props
    }: HTMLInputAttributes & HTMLTextareaAttributes & {
        label?: string;
        placeholder?: string;
        help?: string;
        loading?: boolean;
        search?: boolean;
        clearable?: boolean;
        smallLabel?: boolean;
        type?: HTMLInputTypeAttribute  | 'textarea';
        className?: string;
    } = $props()

    let _label = $derived(label || placeholder)
</script>

<div class="grid gap-1">
    {#if _label && !search}
        <div class="tracking-normal font-medium text-base">
            <div 
                class="ml-3" 
                class:text-sm={smallLabel}
            >
                {_label}
            </div>
        </div> 
    {/if}
    <div 
        class={cn("w-full border focus-within:border-blue-600 focus-within:shadow-2xl focus-within:shadow-blue-600/30 rounded-lg px-3 py-2 placeholder-white/65 text-white bg-transparent flex items-center gap-2", className)}
    >
        {#if search}
            <Icon name={'lucide:search'} size={24} />
        {/if}
        {#if type === 'textarea'}
            <textarea 
                bind:value
                {placeholder}
                {...props}
                class="w-full appearance-none bg-transparent focus:outline-none"
                rows="3"
            ></textarea>
        {:else}
            <input 
                bind:value
                {placeholder}
                type={type}
                {...props}
                class="w-full appearance-none bg-transparent focus:outline-none"
                class:pr-6={loading}
            />
        {/if}

        {#if value && (search || clearable)}
            <button onclick={() => value = ''}>
                <Icon name={'lucide:x'} size={18} />
            </button>
        {/if}

        {#if loading}
            <div class="absolute right-2 top-1">
                <LoadingDots />
            </div>
        {/if}
    </div>
    {#if help}
        <div class="text-sm opacity-45 ml-3">
            {@html help}
        </div>
    {/if}
</div>
