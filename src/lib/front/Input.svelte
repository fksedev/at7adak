<script lang="ts">
    import { cn, LoadingDots, useAutosize, PhoneInput } from "$lib/app"
    import type { Snippet } from "svelte"
    import type { HTMLTextareaAttributes, HTMLInputAttributes } from "svelte/elements"

    type InputTypeAttribute =
        | 'button'
        | 'checkbox'
        | 'color'
        | 'date'
        | 'datetime-local'
        | 'email'
        | 'file'
        | 'hidden'
        | 'image'
        | 'month'
        | 'number'
        | 'password'
        | 'radio'
        | 'range'
        | 'reset'
        | 'search'
        | 'submit'
        | 'tel'
        | 'text'
        | 'time'
        | 'url'
        | 'week'
        | 'textarea'
        | 'phone'
        
    let ref = $state<HTMLInputElement | HTMLTextAreaElement>()

    let {
        label = '', 
        loading = false,
        className,
        type = 'text',
        value = $bindable(),
        autofocus,
        error = '',
        hint = '',
        before,
        after,
        afterLabel,
        valid = $bindable(undefined),
        ...rest
    }: HTMLInputAttributes & HTMLTextareaAttributes & {
        label?: string;
        loading?: boolean;
        className?: string,
        type?: InputTypeAttribute,
        value?: string,
        autofocus?: boolean,
        error?: string,
        hint?: string,
        before?: Snippet,
        after?: Snippet,
        afterLabel?: Snippet,
		valid?: boolean | undefined,
    } = $props()

    $effect(() => {
        if(autofocus) ref?.focus()
    })
</script>

<div class="grid gap-0.5">
    {#if label}
        <div class="flex-between px-2">
            <div class="ms-1 text-start font-hero font-bold italic text-xl">
                {label}
            </div>
            {@render afterLabel?.()}
        </div>
    {/if}

    {#if type === 'phone'}
        <PhoneInput 
            bind:value
            bind:valid
            selected={'LB'}
            className={'flex items-start border rounded-xl focus-within:border-accent focus-within:shadow-lg focus-within:shadow-accent/30'}
            favs={['LB', 'SA', 'AE', 'QA', 'OM', 'BH']}
        />
    {:else}

        <div class={cn("flex items-start border rounded-xl focus-within:border-accent focus-within:shadow-lg focus-within:shadow-accent/30", error && 'border-red focus-within:border-red focus-within:shadow-red/30')}>

            {#if before}
                <div class="py-2 ps-3">
                    {@render before?.()}
                </div>
            {/if}

            {#if type === 'textarea'}
                <textarea
                    bind:this={ref}
                    use:useAutosize
                    class="flex-1 focus:outline-0 px-3 py-2 resize-none"
                    bind:value
                    {...rest}
                ></textarea>
            {:else}
                <input 
                    bind:this={ref}
                    bind:value
                    type={type}
                    {...rest}
                    class="flex-1 w-full focus:outline-none px-3 py-2 appearance-none bg-transparent"
                    class:pr-6={loading}
                />
            {/if}

            {#if loading || after}
                <div class="py-2 pe-3 flex items-center gap-2">
                    {@render after?.()}
                    {#if loading}
                        <LoadingDots />
                    {/if}
                </div>
            {/if}
        </div>

    {/if}

    {#if hint}
        <div class="ms-1 text-start tracking-normal text-xs opacity-65">
            {hint}
        </div>
    {/if}

    {#if error}
        <div class="ms-1 text-start tracking-normal text-xs text-red">
            {error}
        </div>
    {/if}
</div>
