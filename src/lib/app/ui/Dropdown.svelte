<script lang="ts">
	import { cn, Icon, uuid, place, type PlacementOffset, type Placement } from "$lib/app";
	import { onDestroy, onMount, type Snippet } from "svelte";
    import { browser } from "$app/environment"

	type DropdownEvent = "click" | "mouseenter" | "focus";

	let anchor = `dd-trigger-${uuid()}`

    let {
        shadow = false,
        placement = 'bottom-end',
        flip = true,
        offset = {x: 0, y: 3},
        event = 'click',
        className = 'p-3 w-52',
        width = undefined,
        height = undefined,
		triggerClass,
		trigger,
        children,
    }: {
        shadow?: boolean;
        placement?: Placement;
        flip?: boolean;
        offset?: PlacementOffset;
        event?: DropdownEvent | undefined;
        className?: string;
        width?: string | undefined;
        height?: string | undefined;
		triggerClass?: string;
        trigger?: Snippet;
        children: Snippet;
    } = $props()

	let resizeObserver: ResizeObserver;
	let visible = $state(false)
	let minWidth: string | undefined = $state(undefined)
	let currentPlacement: Placement | undefined = $state();
	let anchorRef: HTMLElement | undefined = $state();
	let ref: HTMLElement | undefined = $state();
	let hasCreatedListener = $state(false);

	$effect(() => {
		if(browser) {
			const element = document.querySelector('.'+anchor) as HTMLElement;
			if (!element) throw new Error(`The '${anchor}' query does not find an element in the document.`);
			anchorRef = element;
			
			if(anchorRef) setTimeout(() => resize(placement), 100);
		}
	})

	$effect(() => {
		if(browser) {
			if (anchorRef && event && !hasCreatedListener) {
				switch (event) {
					case "click":
						anchorRef.addEventListener("click", toggle);
						break;
					case "focus":
						anchorRef.addEventListener("focus", show);
						anchorRef.addEventListener("blur", hide);
						break;
					case "mouseenter":
						anchorRef.addEventListener("mouseenter", show);
						anchorRef.addEventListener("mouseleave", hide);
						break;
				}
				resize(placement);
				hasCreatedListener = true;
			}
		}
	})

	$effect(() => {
		if(browser) {
			if (anchorRef != undefined && ref != undefined && resizeObserver != undefined) {
				resize(placement);
				resizeObserver.observe(anchorRef);
				resizeObserver.observe(ref);
			}
		}
	})

	const toggle = () => visible = !visible;
	const show = () => visible = true;
	const hide = () => visible = false;

	const resize = (p: Placement) => {
		if (anchorRef == undefined || ref == undefined) return;
		currentPlacement = place(anchorRef, ref, { placement: p, flip, offset });
		minWidth = anchorRef.offsetWidth+'px'
	};

	const docClick = (e: MouseEvent) => {
		const target = e.target as Node;
		if (!ref?.contains(target) && !anchorRef!.contains(target)) visible = false;
	};

	const docKeydown = (e: KeyboardEvent) => {
		if (e.key == "Escape" && visible) hide();
	};

	onMount(() => {
		setTimeout(() => resize(placement), 300)
		resizeObserver = new ResizeObserver(() => {
			resize(placement);
		});

		return () => {
			resizeObserver.disconnect();
		};

	});

	onDestroy(() => {
		if (!anchorRef) return;

		switch (event) {
			case "click":
				anchorRef.removeEventListener("click", toggle);
				break;
			case "focus":
				anchorRef.removeEventListener("focus", show);
				anchorRef.removeEventListener("blur", hide);
				break;
			case "mouseenter":
				anchorRef.removeEventListener("mouseenter", show);
				anchorRef.removeEventListener("mouseleave", hide);
				break;
		}
	});
	
</script>

<svelte:document onclick={docClick} onkeydown={docKeydown} />
<svelte:window onresize={() => resize(placement)} onscroll={() => resize(placement)} />

<button type="button" class={`${anchor} ${triggerClass}`}>
	{#if trigger}
		{@render trigger?.()}
	{:else}
		<Icon name={'ph:dots-three-light'} size={24} />
	{/if}
</button>
<div
	bind:this={ref}
	style="{width ? `width: ${width};` : ''} {minWidth ? `min-width: ${minWidth};` : ''} {height ? `height: ${height};` : ''}"
	class={cn(
		'absolute z-999 border bg-black rounded-lg min-w-52 p-3 transition-all duration-300',
		shadow ? 'shadow-md' : '',
		visible ? 'opacity-100': 'opacity-0 pointer-events-none scale-95',
		className
	)}
>
	{@render children?.()}
</div>
