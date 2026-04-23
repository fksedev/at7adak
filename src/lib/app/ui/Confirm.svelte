<script lang="ts">
    import { fly, fade } from "svelte/transition"
    import Btn from "./Btn.svelte"

    let {
        open = $bindable(false),
        fn = () => null,
        confirmText = "Confirm", 
        cancelText = "Cancel", 
        title = 'Are you sure?', 
        desc = "This action can't be undone!",
        centered = false,
        children,
    } = $props()

    let duration = 65

</script>

{@render children?.()}

{#if open}
    <div
        class="select-none fixed inset-0 z-998 bg-primary/20 backdrop-blur-sm"
        in:fade={{ duration }}
        out:fade={{ delay: duration, duration }}
    ></div>

    <div
        class="fixed z-999 shadow rounded-[20px] bg-primary border border-gray-700 outline-hidden top-[50%] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] sm:max-w-122.5 md:w-full overflow-hidden"
        class:left-[50%]={centered}
        class:left-[75%]={!centered}
        in:fly={{
            y: -30,
            opacity: 0,
            delay: duration,
            duration,
        }}
        out:fly={{
            y: -30,
            opacity: 0,
            duration,
        }}
    >
        <div class="text-center space-y-4 text-white">

            <div class="flex w-full items-center justify-center text-lg font-semibold tracking-tight bg-gray-900 py-3 border-b border-gray-700">
                {@html title}
            </div>

            <div class="p-5 space-y-10">
                <div class="text-lg">
                    {@html desc}
                </div>
    
                <div class="grid grid-cols-2 gap-4">
                    <Btn 
                        title={cancelText}
                        className={'border-gray-700 text-white enabled:hover:border-gray-500'}
                        onclick={() => open = false}
                    />
                    <Btn 
                        title={confirmText}
                        className={'border-red text-red enabled:hover:bg-red/5 enabled:hover:border-red'}
                        onclick={() => {
                            fn?.()
                            open = false
                        }}
                    />
                </div>
            </div>
        </div>

    </div>
{/if}
