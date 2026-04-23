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
        useHover,
        useInteractions,
        useRole,
        type Placement,
    } from "$lib/app/helpers/floating-ui/svelte"
    import type { Snippet } from "svelte"
    import { fade } from "svelte/transition"

    let {
        position = 'top',
        content,
        children,
        className,
        arrowColor = '#000',
    }: {
        position?: Placement,
        content: string,
        children: Snippet,
        className?: string,
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
    const role = useRole(floating.context, { role: "tooltip" });
    const hover = useHover(floating.context, { move: false });
    const dismiss = useDismiss(floating.context);
    const interactions = useInteractions([role, hover, dismiss]);
</script>

<div>
    <!-- Reference Element -->
    <div
        bind:this={floating.elements.reference}
		{...interactions.getReferenceProps()}
    >
        {@render children?.()}
    </div>

    <!-- Floating Element -->
    {#if open}
        <div
			bind:this={floating.elements.floating}
			style={floating.floatingStyles}
			{...interactions.getFloatingProps()}
			class={cn("absolute top-0 left-0 w-fit max-w-80 font-sans bg-black rounded px-3 py-1 text-white text-sm text-center space-y-1 z-999", className)}
			transition:fade={{ duration: 200 }}
		>
            {@html content}

            {#if arrowColor}
                <FloatingArrow 
                    bind:ref={elemArrow} 
                    context={floating.context} 
                    fill={arrowColor} 
                />
                
            {/if}
        </div>
    {/if}
</div>
