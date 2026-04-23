<script lang="ts">
    import { useCollapse, pad, Icon, cn } from "$lib/app"
    
    let {
        items,
        open = -1,
        withNum = false,
        className = '',
        containerClass = '',
        questionClass = '',
        answerClass = '',
        numClass = '',
        iconName = 'carbon:chevron-down',
        iconSize = 24,
    }: {
        items: { question: string; answer: string; }[];
        open?: number;
        withNum?: boolean;
        className?: string;
        containerClass?: string;
        questionClass?: string;
        answerClass?: string;
        numClass?: string;
        iconName?: string;
        iconSize?: number;
    } = $props()

</script>

<div class={cn("grid", containerClass)}>
    {#each items as item, i}
        <button 
            class={cn(
                "border-b border-white/15 relative cursor-pointer w-full text-start", 
                i === items.length - 1 && 'border-transparent',
                className
            )} 
            onclick={() => open = open === i ? -1 : i}
        >
            <div class="flex items-start py-5">
                {#if withNum}
                    <div class={cn("opacity-50 text-xs pt-1 pr-3", numClass)}>
                        {pad(i + 1)}
                    </div>
                {/if}
                <div class={cn("grow cursor-pointer font-medium pr-3", questionClass)}>
                    {@html item.question}
                </div>
                <div class="opacity-65 transition-all duration-300"
                    class:rotate-180={open === i}
                >
                    <Icon name={iconName} size={iconSize} />
                </div>
            </div>
            
            <div use:useCollapse={{
                open: open === i,
                duration: 0.45
            }}>
                <div class={cn("pb-6 opacity-90 whitespace-pre-line", answerClass)}>
                    {@html item.answer}
                </div>
            </div>
        </button>
    {/each}

</div>
