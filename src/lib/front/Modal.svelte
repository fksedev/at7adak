<script lang="ts">
    import { Icon, cn } from "$lib/front"
    import type { Snippet } from "svelte"
    import { fly } from "svelte/transition"

    let {
        open = $bindable(false),
        title = "",
        fullSize = false,
        closable = true,
        className = "",
        containerClass = "",
        TopLeft,
        Header,
        children,
    }: {
        open: boolean,
        title?: string,
        fullSize?: boolean,
        closable?: boolean,
        className?: string,
        containerClass?: string,
        TopLeft?: Snippet,
        Header?: Snippet,
        children?: Snippet,
    } = $props()
</script>

{#if open}
    <!-- MODAL -->
    <div 
        class="fixed z-1002 inset-0 size-screen bg-black/50 backdrop-blur flex-center"
    >
        <!-- MODAL DIALOG -->
        <div
            class={cn(
                "relative pointer-events-none size-screen md:w-auto md:h-auto transition-all duration-300",
                fullSize && 'md:size-screen',
                containerClass,
            )}
            in:fly={{y: -20, duration: 200}}
        >
            <!-- MODAL CONTENT -->
            <div 
                class={cn(
                    "relative flex flex-col pointer-events-auto transition-all duration-300 ease-in-out-quad bg-black text-foreground md:border",
                    fullSize ? 'size-screen' : 'md:rounded-lg size-screen md:size-fit',
                    className
                )}
            >
                <!-- HEADER -->
                <div class="flex-between p-3 relative">
                    <div>
                        {@render TopLeft?.()}
                    </div>
                    <div>
                        {@render Header?.()}
                    </div>
                    {#if closable}
                        <div class="md:absolute md:-right-3 md:-top-3">
                            <button 
                                type="button" 
                                class="flex-center pointer-events-auto z-50 size-7 rounded-full border border-border/10 bg-green text-black trans hover:opacity-50" 
                                onclick={() => open = false}
                            >
                                <Icon name={'si:close-line'} size={24} />
                            </button>
                        </div>
                    {/if}
                </div>

                <!-- BODY -->
                <div 
                    class="overflow-y-auto h-full relative px-4 pb-4 md:px-8 md:pb-8 pt-0 space-y-4"
                    class:max-h-[85vh]={!fullSize}
                >
                    {#if title}
                        <h5 class="font-medium text-2xl">{title}</h5>
                    {/if}
                    {@render children?.()}
                </div>
            </div>
        </div>
    </div>
{/if}
