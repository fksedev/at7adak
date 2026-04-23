<script lang="ts">
    import { onDestroy, onMount, type Snippet } from 'svelte'
    import { draggable } from '../helpers';
    import { fly } from 'svelte/transition'
    let { 
        open = $bindable(), 
        closable = true,
        children 
    }: {
        open: boolean;
        closable?: boolean;
        children?: Snippet;
    } = $props()

    let el = $state<HTMLElement>()
    let position = $state({x: 0, y: 0})
    let top = $state(0)
    let duration = $state(100)

    $effect(() => {
        reset()
        if (typeof window !== "undefined" && document) {
			document.body.classList.toggle("overflow-hidden", open);
		}
    })

    const reset = () => {
        if(!open) position.y = 0
        if(open) {
            top = el.getBoundingClientRect().top
            setTimeout(() => top = el.getBoundingClientRect().top, duration + 50)
        }
    }

    onMount(() => {	
        if(typeof window !== 'undefined') window.addEventListener('resize', reset);
	});
	
	onDestroy(() => {
		if(typeof window !== 'undefined') window.removeEventListener('resize', reset);
	});
</script>

{#if open}
    <button aria-label="overlay"
        class="fixed inset-0 z-[49] bg-black/40 backdrop-blur-sm"
        onclick={() => {
            if(closable) open = false
        }}
    ></button>

    <div 
        bind:this={el}
        class="fixed inset-x-0 bottom-0 z-50 mt-24 rounded-t-[10px] bg-white"
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
                <div class="bg-gray-300 mx-auto h-2 w-[100px] rounded-full"></div>
            </div>
            <div class="max-h-[94vh] overflow-y-auto overscroll-none py-10 px-5">
                {@render children?.()}
            </div>
        </div>
    </div>
{/if}
