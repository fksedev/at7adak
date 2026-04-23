<script lang="ts">
    import { Dots, Icon } from "$lib/app"
    import Carousel from './carousel'
    let {
        images,
        infinite = false,
    }: {
        images: string[],
        infinite?: boolean,
    } = $props()

</script>
<div class="select-none h-full ltr">
    {#key images}
        <Carousel 
            infinite={infinite} 
            carouselClass={'h-full max-w-[calc(100vw-32px)]'} 
            containerClass={'h-full relative rounded-2xl overflow-hidden bg-light'}
        >
            {#snippet renderItems({ loaded, currentPageIndex })}
                {#each images as src, imageIndex (src)}
                    <div class="touch-pan-y h-full flex-center relative" class:z-[1]={imageIndex === currentPageIndex}>
                        <img src={src} alt={''} class="h-full w-auto max-w-7xl">
                    </div>
                {/each}
            {/snippet}

            {#snippet renderPrev({ currentPageIndex, goToPrev})}
                <div class="absolute inset-y-0 left-3 flex-center z-10 pointer-events-none">
                    {#if infinite || (!infinite && currentPageIndex! > 0)}
                        <button 
                            onclick={goToPrev}
                            class="rotate-180 size-8 rounded-full bg-[#0000001b] text-[#0000008f] flex-center pointer-events-auto"
                        >
                            <Icon name={"ph:caret-right-light"} size={20} />
                        </button>
                    {/if}
                </div>
            {/snippet}

            {#snippet renderNext({ currentPageIndex, goToNext, pagesCount})}
                <div class="absolute inset-y-0 right-3 z-10 flex-center pointer-events-none">
                    {#if infinite || (!infinite && currentPageIndex! < pagesCount! - 1)}
                        <button 
                            onclick={goToNext}
                            class="size-8 rounded-full bg-[#0000001b] flex-center text-[#0000008f] pointer-events-auto"
                        >
                            <Icon name={"ph:caret-right-light"} size={20} />
                        </button>
                    {/if}
                </div>
            {/snippet}

            
            {#snippet renderDots({ currentPageIndex, pagesCount })}
                <Dots 
                    index={currentPageIndex}
                    count={pagesCount}
                    size={9}
                    spacing={2}
                    color={'#0000006b'}
                    className="-mt-6"
                />
            {/snippet}
            
        </Carousel>
    {/key}
</div>
