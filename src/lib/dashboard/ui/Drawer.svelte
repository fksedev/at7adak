<script lang="ts">
    import { onDestroy, onMount, type Snippet } from 'svelte'
    import { draggable } from './helpers';
    import { cn } from "$lib/dashboard"
    import { fly } from 'svelte/transition'
    import { browser } from '$app/environment'

    let { 
        open = $bindable(), 
        closable = true,
        children,
        className = '',
        bgClass = '',
        handleClass = '',
    }: {
        open: boolean;
        closable?: boolean;
        children?: Snippet;
        className?: string;
        bgClass?: string;
        handleClass?: string;
    } = $props()

    let el = $state<HTMLElement>()
    let position = $state({x: 0, y: 0})
    let top = $state(0)
    let duration = $state(100)

    $effect(() => {
        if (browser) {
            if(open) {
                document.body.classList.add("overflow-hidden");
            } else {
                document.body.classList.remove("overflow-hidden");
            }
		}
    })

    const updateTop = () => top = el!.getBoundingClientRect().top

    const detectImgs = () => {
        const imagesLoaded = Array.from(el!.querySelectorAll("img"));
        if (imagesLoaded.length === 0) return;
        imagesLoaded.forEach((image) => {
            image.addEventListener("load", updateTop, { once: true });
            image.addEventListener("error", updateTop, {once: true});
        });
    }

    $effect(() => {
        reset()
    })

    const reset = () => {
        if(!open) position.y = 0
        if(open) {
            updateTop()
            setTimeout(updateTop, duration + 50)
            setTimeout(detectImgs, duration + 50)
        }
    }

    onMount(() => {	
        if(browser) window.addEventListener('resize', reset);
	});
	
	onDestroy(() => {
		if(browser) window.removeEventListener('resize', reset);
	});
</script>

{#if open}
    <button aria-label="overlay"
        class={cn("fixed inset-0 z-[49] bg-gray-0/20 backdrop-blur", bgClass)}
        onclick={() => {
            if(closable) open = false
        }}
    ></button>
    
    <div 
        bind:this={el}
        class={cn("fixed inset-x-0 bottom-0 z-50 mt-24 rounded-t-[10px] bg-gray-990", className)}
        transition:fly={{y: 50, duration }}
        use:draggable={{
            axis: 'y', 
            position,
            bounds: { top, bottom: -400 },
            onDrag: ({offsetX, offsetY }) => {
                position = {x: offsetX, y: offsetY}
                if(offsetY >= 250) open = false
            },
            onDragEnd: ({ offsetY }) => {
                if(offsetY < 250) position.y = 0
            },
        }}
    >
        <div class="relative">
            <div class="pt-4 pb-64 md:pb-4 fixed top-0 inset-x-0">
                <div class={cn("bg-gray-900 mx-auto h-2 w-[100px] rounded-full", handleClass)}></div>
            </div>
            <div class="max-h-[94vh] overflow-y-auto overscroll-none py-10 px-5">
                {@render children?.()}
            </div>
        </div>
    </div>
{/if}
