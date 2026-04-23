<script lang="ts">
	import { cn } from '$lib/app';
    import {
        FloatingArrow,
        arrow,
        autoUpdate,
        flip,
        offset,
        useClick,
        useDismiss,
        useFloating,
        useInteractions,
        useRole,
        type Placement,
    } from "$lib/app/helpers/floating-ui/svelte"
    import type { Snippet } from "svelte"
    import { fade } from "svelte/transition"

    let {
        position = 'top',
        content,
        contentSnippet,
        children,
        className,
        hideArrow = false,
        arrowColor = '#000',
    }: {
        position?: Placement,
        content?: string,
        contentSnippet?: Snippet,
        children: Snippet,
        className?: string,
        hideArrow?: boolean,
        arrowColor?: string | null,
    } = $props()

    // State
    let open = $state(false)
    let elemArrow: HTMLElement | null = $state(null)

    // Use Floating
    const floating = useFloating({
        whileElementsMounted: autoUpdate,
        get open() {
            return open;
        },
        onOpenChange: (v) => {
            open = v;
        },
        // svelte-ignore state_referenced_locally
        placement: position,
        get middleware() {
            return [offset(10), flip(), elemArrow && arrow({ element: elemArrow })];
        },
    });

    // Interactions
    const role = useRole(floating.context, { role: 'tooltip'});
    const click = useClick(floating.context);
    const dismiss = useDismiss(floating.context);
    const interactions = useInteractions([role, click, dismiss]);
</script>

<div>
    <div
        bind:this={floating.elements.reference}
		{...interactions.getReferenceProps()}
    >
        {@render children?.()}
    </div>
    
    {#if open}
        <div
			bind:this={floating.elements.floating}
			style={floating.floatingStyles}
			{...interactions.getFloatingProps()}
			class={cn("absolute top-0 left-0 w-fit max-w-80 font-sans bg-black rounded-xl p-3 border text-white text-sm text-center space-y-2 z-999", className)}
			transition:fade={{ duration: 200 }}
		>
            {#if contentSnippet}
                {@render contentSnippet?.()}
            {:else}
                {@html content}
            {/if}

            {#if !hideArrow}
                <FloatingArrow 
                    bind:ref={elemArrow} 
                    context={floating.context} 
                    fill={arrowColor!} 
                />
                
            {/if}
        </div>
    {/if}
</div>
