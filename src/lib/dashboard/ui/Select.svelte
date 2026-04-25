<script lang="ts">
    import type { HTMLSelectAttributes } from "svelte/elements"
    import { cn } from "$lib/dashboard";

    type Option = {
        value: String | Number;
        label: String;
    }

    let {
        value = $bindable(),
        label = '', 
        name = '', 
        smallLabel = false, 
        options = [],
        className = '',
        ...props
    }: HTMLSelectAttributes & {
        label?: string;
        name?: string;
        smallLabel?: boolean;
        options: Option[] | string[];
        className?: string;
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

<div>
    {#if label}
        <div class="tracking-normal font-medium text-base mb-1">
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
        class={cn("relative border rounded-lg min-h-9 px-3 py-2 bg-transparent", className)}
    >
        <select 
            class="w-full appearance-none bg-transparent focus:outline-0 min-w-[160px]"
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
    </div>
</div>

<style>
    select {
        -moz-padding-start: calc(.75rem - 3px);
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23aaa' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
        background-position: right 1px center;
        background-repeat: no-repeat;
        background-size: 16px 12px;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }
</style>
