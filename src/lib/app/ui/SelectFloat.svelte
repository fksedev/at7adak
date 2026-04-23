<script lang="ts">
    import { cn, uuid, Icon } from "$lib/app"
    import type { HTMLSelectAttributes } from "svelte/elements"

    type Option = {
        value: String | Number;
        label: String;
    }

    let {
        value = $bindable(''),
        name = "",
        label = "",
        id = uuid(),
        options = [],
        append = "",
        error = "",
        className = "",
        containerClass = "",
        rtl = false,
        ...props
    }: HTMLSelectAttributes & {
        value: string,
        name?: string,
        label?: string,
        id?: string,
        options: Option[] | string[];
        append?: string,
        error?: string,
        className?: string,
        containerClass?: string,
        rtl?: boolean,
    } = $props()

    let _options = $state<Option[]>([])

    $effect(() => {
        if(options.length) {
            _options = options.map(x => {
                if (typeof x !== 'object') return { label: `${x}`, value: x }
                return x
            })
        }
    })
</script>

<div class={cn("h-[58px] relative text-dark", containerClass)}>
    
    <div
        class={cn(
            "relative px-3 pt-[26px] pb-[10px] w-full flex items-center border bg-white rounded text-base", 
            error ? 'border-red' : 'border-dark/30',
            className
        )}
    >
        <select 
            class="flex-1 appearance-none bg-transparent focus:outline-0 min-w-[160px]"
            {id}
            {name}
            bind:value
            {...props}
        >
            {#each _options as opt, i}
                <option value={opt.value} selected={value === opt.value}>
                    {opt.label}
                </option>
            {/each}
        </select>

        <div class="px-px">
            <Icon name={'lucide:chevrons-up-down'} size={16} />
        </div>
    </div>
    <label for={id}
        class={cn(
            "inline-block border border-transparent py-4 px-3 h-full w-full absolute -top-2 overflow-hidden pointer-events-none text-ellipsis whitespace-nowrap transition-all text-base opacity-75 scale-[85%]",
            rtl ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
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
{#if error}
    <div class="text-xs text-red mt-1">{error}</div>
{/if}
