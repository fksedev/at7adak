<script lang="ts">
    import { RellaxScroll } from "./rellax-scroll"
    import { onDestroy, onMount, type Snippet } from "svelte";
    
    let el
    let rellax = $state()

    let {
        speed = -2,
        speedXS = undefined,
        zindex = 0,
        center = false,
        horizontal = false,
        percentage = undefined,
        className = '',
        children,
        ...props
    }: {
        speed?: number;
        speedXS?: number;
        zindex?: number;
        center?: boolean;
        horizontal?: boolean;
        percentage?: number;
        className?: string;
        children?: Snippet;
    } = $props()

    onMount(() => {
        rellax = new (RellaxScroll as any)(el, {
            center,
            horizontal,
            vertical: !horizontal,
        })
    })

    onDestroy(() => {
        // @ts-ignore
        if(rellax) rellax.destroy()
    })
</script>

<div 
    bind:this={el} 
    data-rellax-speed={speed} 
    data-rellax-mobile-speed={speedXS} 
    data-rellax-xs-speed={speedXS} 
    data-rellax-percentage={percentage}
    data-rellax-zindex={zindex}
    class={className} 
    {...props}
>
    {@render children?.()}
</div>
