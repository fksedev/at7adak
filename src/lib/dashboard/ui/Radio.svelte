<script lang="ts">
    import { cn, uuid } from "$lib/dashboard"

    type Option = {
        value: string | number;
        label: string;
    }

    let {
        label = '',
        value = $bindable(),
        options = [],
        name = '', 
        className = '',
        onchange,
    }:  {
        label?: string;
        value?: string | number;
        options: Option[] | string[];
        id?: string;
        name?: string;
        className?: string;
        onchange?: (value: string | number) => void;
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

    let group = $state(`radio-${uuid()}`)
</script>

<div class="grid gap-1">
    {#if label}
        <div class="tracking-normal font-medium text-base">
            <div class="ml-3">
                {label}
            </div>
        </div> 
    {/if}
    
    <div class="flex shrink-0 gap-2 items-center">
        {#each _options as opt, i}
            <div class="relative shrink-0">
                <input 
                    type="radio" 
                    class="absolute pointer-events-none" 
                    style="clip: rect(0, 0, 0, 0);"
                    {name}
                    {group}
                    value={opt.value}
                    checked={opt.value === value}
                />
                <button type="button" 
                    class={cn(
                        "border inline-block cursor-pointer select-none align-middle text-center font-medium rounded-lg px-3 py-1 transition-all duration-300",
                        value === opt.value ? `bg-white text-gray-900 hover:bg-white` : 'hover:bg-blue-600/20',
                        className
                    )}
                    onclick={async () => {
                        value = opt.value
                        onchange?.(opt.value)
                    }}
                >
                    {opt.label}
                </button>
            </div>
        {/each}
    </div>
</div>
