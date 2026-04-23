<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
    import { Icon } from '$lib/app'

	interface MousePosI {
		x: number;
		y: number;
	}
	interface SizeI {
		width: number;
		height: number;
	}
	type Direction = 'ne' | 'nw' | 'se' | 'sw'

    let { 
        position = 'se',
        className = '',
        onclick,
        onrelease,
        onmove,
        children,
    }: { 
        position?: Direction,
        className?: string,
        onclick?: () => void, 
        onrelease?: () => void, 
        onmove?: () => void, 
        children?: Snippet,
    } = $props()

	let ref: Element = $state();
	let dragging = $state(false);
	let mousepos = $state<MousePosI | null>(null);
	let originalSize = $state<SizeI | null>(null);
	let extrawidth = $state(0);
	let extraheight = $state(0);

	let padding = $state(10);

	let height = $derived(originalSize ? originalSize.height + extraheight : 0)
	let width = $derived(originalSize ? originalSize.width + extrawidth : 0)

	onMount(() => {
		originalSize = ref.getBoundingClientRect();
	});

	function onClick(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
		dragging = true;
		onclick?.()
		originalSize = ref.getBoundingClientRect();
		mousepos = null;
		extrawidth = 0;
		extraheight = 0;
	}

	function onRelease(e: MouseEvent) {
		if (dragging) {
			onrelease?.()
			mousepos = null;
			dragging = false;
		}
	}

	function handleMousemove(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
		if (dragging) {
			if (mousepos === null) {
				mousepos = { x: e.x, y: e.y };
			} else {
				switch (position) {
					case 'ne':
						extraheight += -e.y + mousepos.y;
						extrawidth += e.x - mousepos.x;
						break;
					case 'nw':
						extraheight += -e.y + mousepos.y;
						extrawidth -= e.x - mousepos.x;
						break;
					case 'se':
						extraheight -= -e.y + mousepos.y;
						extrawidth += e.x - mousepos.x;
						break;
					case 'sw':
						extraheight -= -e.y + mousepos.y;
						extrawidth -= e.x - mousepos.x;
						break;
				}
				mousepos = { x: e.x, y: e.y };
				onmove?.()
			}
		}
	}
</script>

{#if dragging}
	<button type="button" aria-label="resizer"
		class="fixed inset-0 z-[999999]"
		onmousemove={handleMousemove}
		onmouseup={onRelease}
	></button>
{/if}

<div
	class={`relative ${className}`}
	bind:this={ref}
	style={originalSize ? `height:${height - padding * 2}px;width:${width - padding * 2}px` : ''}
>
	<div class="w-full h-full">
		{@render children?.()}
	</div>
    
	<button type="button"
		onmousedown={onClick}
		class={`absolute p-1`}
		class:top-0={position === 'ne' || position === 'nw'}
		class:bottom-0={position === 'se' || position === 'sw'}
		class:right-0={position === 'ne' || position === 'se'}
		class:left-0={position === 'nw' || position === 'sw'}
		class:-rotate-90={position === 'ne'}
		class:rotate-0={position === 'se'}
		class:rotate-180={position === 'nw'}
		class:rotate-90={position === 'sw'}
		class:cursor-ne-resize={position === 'ne'}
		class:cursor-nw-resize={position === 'nw'}
		class:cursor-se-resize={position === 'se'}
		class:cursor-sw-resize={position === 'sw'}
	>
        <Icon name={'lets-icons:resize-down-right'} size={18} />
    </button>
</div>
