<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements"
    import { cn, uuid } from "$lib/app"
    type Option = {
        value: String | Number;
        label: String;
    }

    let {
        value = $bindable(),
        selected = $bindable(),
        options = [],
        id = uuid(),
        name = '', 
        className = '',
        ...props
    }: HTMLInputAttributes & {
        selected?: string | number;
        options: Option[] | string[];
        id?: string;
        name?: string;
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

<div 
    class="flex shrink-0 gap-2 items-center" 
>
    {#each _options as { value, label }, i}
        <div class="relative shrink-0">
            <input 
                type="radio" 
                class="absolute pointer-events-none" 
                style="clip: rect(0, 0, 0, 0);"
                id={id+'-'+i}
                {name} 
                {value}
                bind:group={selected}
            />
            <label 
                class={cn(
                    "border border-white/15 inline-block cursor-pointer select-none align-middle text-center font-medium rounded-lg px-3 py-1 hover:bg-pink/20 hover:text-white transition-all duration-300",
                    value === selected ? ` bg-pink text-primary` : '',
                    className
                )}
                for={id+'-'+i}
            >
                {label}
            </label>
        </div>
    {/each}
</div>
