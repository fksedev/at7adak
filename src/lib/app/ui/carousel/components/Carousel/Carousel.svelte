<script lang="ts">
    import { onDestroy, onMount, tick, type Snippet } from "svelte"
    import Dots from "../Dots/Dots.svelte"
    import Arrow from "../Arrow/Arrow.svelte"
    import Progress from "../Progress/Progress.svelte"
    import { swipeable } from "../../actions/swipeable"
    import { hoverable } from "../../actions/hoverable"
    import { tappable } from "../../actions/tappable"
    import { applyParticleSizes, createResizeObserver } from "../../utils/page"
    import { getClones, applyClones } from "../../utils/clones"
    import { switcher } from "../../utils/object"
    import createCarousel from "./createCarousel"

    // used for lazy loading images, preloaded only current, adjacent and cloanable images
    let loaded = $state<number[]>([])
    let currentPageIndex = $state<number>(-1)
    let progressValue = $state<number>(0)
    let offset = $state<number>(0)
    let durationMs = $state<number>(0)
    let pagesCount = $state<number>(1)

    const [{ data, progressManager }, methods, service] = createCarousel(
        (key, value) => {
            switcher({
                currentPageIndex: () => (currentPageIndex = value),
                progressValue: () => (progressValue = value),
                offset: () => (offset = value),
                durationMs: () => (durationMs = value),
                pagesCount: () => (pagesCount = value),
                loaded: () => (loaded = value),
            })(key)
        }
    )

    type Variables  = { 
        currentPageIndex?: number, 
        pagesCount?: number, 
        loaded?: number[],
        goTo?: (n: number, animated?) => void, 
        goToPrev?: (animated?) => void, 
        goToNext?: (animated?) => void, 
    }
    
    let {
        onPageChange,
        onclick,
        renderDots,
        renderNext,
        renderPrev,
        renderItems,
        carouselClass = '',
        carouselStyle = '',
        containerClass = '',
        containerStyle = '',
        timingFunction = 'ease-in-out', // 'linear', 'steps(5, end)', 'cubic-bezier(0.1, -0.6, 0.2, 0)'
        arrows = true,
        infinite = true,
        initialPageIndex = 0,
        duration = 300,
        autoplay = false,
        autoplayDuration = 3000,
        autoplayDirection = 'next',
        pauseOnFocus = false,
        autoplayProgressVisible = false,
        dots = true,
        swiping = true,
        particlesToShow = 1,
        particlesToScroll = 1,
    }: {
        onPageChange?: (n: number) => void,
        onclick?: () => void,
        renderDots?: Snippet<[Variables]>,
        renderNext?: Snippet<[Variables]>,
        renderPrev?: Snippet<[Variables]>,
        renderItems?: Snippet<[Variables]>,
        carouselClass?: string,
        carouselStyle?: string,
        containerClass?: string,
        containerStyle?: string,
        timingFunction?: string,
        arrows?: boolean,
        infinite?: boolean,
        initialPageIndex?: number,
        duration?: number,
        autoplay?: boolean,
        autoplayDuration?: number,
        autoplayDirection?: 'next' | 'prev',
        pauseOnFocus?: boolean,
        autoplayProgressVisible?: boolean,
        dots?: boolean,
        swiping?: boolean,
        particlesToShow?: number,
        particlesToScroll?: number,
    } = $props()

    $effect(() => {
        data.infinite = infinite
        data.durationMsInit = duration
        data.autoplay = autoplay
        data.autoplayDuration = autoplayDuration
        data.autoplayDirection = autoplayDirection
        data.pauseOnFocus = pauseOnFocus
        data.particlesToShowInit = particlesToShow
        data.particlesToScrollInit = particlesToScroll
    })

    $effect(() => {
        onPageChange?.(currentPageIndex)
    })

    async function goTo(pageIndex: number, animated: boolean = true) {
        if (typeof pageIndex !== "number") {
            throw new Error("pageIndex should be a number")
        }
        await methods.showPage(pageIndex, { animated })
    }

    async function goToPrev(animated: boolean = true) {
        await methods.showPrevPage({ animated })
    }

    async function goToNext(animated: boolean = true) {
        await methods.showNextPage({ animated })
    }

    let pageWindowWidth = 0
    let pageWindowElement
    let particlesContainer

    const pageWindowElementResizeObserver = createResizeObserver(
        ({ width }) => {
            pageWindowWidth = width
            data.particleWidth = pageWindowWidth / data.particlesToShow

            applyParticleSizes({
                particlesContainerChildren: particlesContainer.children,
                particleWidth: data.particleWidth,
            })
            methods.offsetPage({ animated: false })
        }
    )

    function addClones() {
        const { clonesToAppend, clonesToPrepend } = getClones({
            clonesCountHead: data.clonesCountHead,
            clonesCountTail: data.clonesCountTail,
            particlesContainerChildren: particlesContainer.children,
        })
        applyClones({
            particlesContainer,
            clonesToAppend,
            clonesToPrepend,
        })
    }

    onMount(() => {
        ;(async () => {
            await tick()
            if (particlesContainer && pageWindowElement) {
                data.particlesCountWithoutClones =
                    particlesContainer.children.length

                await tick()
                data.infinite && addClones()

                // call after adding clones
                data.particlesCount = particlesContainer.children.length

                methods.showPage(initialPageIndex, { animated: false })

                pageWindowElementResizeObserver.observe(pageWindowElement)
            }
        })()
    })

    onDestroy(() => {
        pageWindowElementResizeObserver.disconnect()
        progressManager.reset()
    })

    async function handlePageChange(pageIndex) {
        await methods.showPage(pageIndex, { animated: true })
    }

    // gestures
    function handleSwipeStart(event) {
        if (!swiping) return
        data.durationMs = 0
    }
    async function handleSwipeThresholdReached(event) {
        if (!swiping) return
        await switcher({
            ['next']: methods.showNextPage,
            ['prev']: methods.showPrevPage,
        })(event.detail.direction)
    }
    function handleSwipeMove(event) {
        if (!swiping) return
        data.offset += event.detail.dx
    }
    function handleSwipeEnd() {
        if (!swiping) return
        methods.showParticle(data.currentParticleIndex)
    }
    async function handleSwipeFailed() {
        if (!swiping) return
        await methods.offsetPage({ animated: true })
    }

    function handleHovered(event) {
        data.focused = event.detail.value
    }
    function handleTapped() {
        // console.log('TAPPED')
        methods.toggleFocused()
        onclick?.()
    }

    // export const thresholdProvider = pageWindowWidth/3
    const thresholdProvider = 16
</script>

<div
    class={`sc-carousel__carousel-container ${carouselClass}`}
    style={carouselStyle}
>
    <div
        class={`sc-carousel__content-container ${containerClass}`}
        style={containerStyle}
    >
        {#if arrows}
            {#if renderPrev}
                {@render renderPrev({ currentPageIndex, pagesCount, loaded, goTo, goToPrev, goToNext })}
            {:else}
                <div class="sc-carousel__arrow-container">
                    <Arrow
                        direction="prev"
                        disabled={!infinite && currentPageIndex === 0}
                        onclick={() => methods.showPrevPage()}
                    />
                </div>
            {/if}
        {/if}
        
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="sc-carousel__pages-window"
            bind:this={pageWindowElement}
            use:hoverable
            onhovered={handleHovered}
            use:tappable
            ontapped={handleTapped}
            ondblclick={onclick}
        >
            <div
                class="sc-carousel__pages-container"
                use:swipeable={{ thresholdProvider }}
                onswipeStart={handleSwipeStart}
                onswipeMove={handleSwipeMove}
                onswipeEnd={handleSwipeEnd}
                onswipeFailed={handleSwipeFailed}
                onswipeThresholdReached={handleSwipeThresholdReached}
                style="
                    transform: translateX({offset}px);
                    transition-duration: {durationMs}ms;
                    transition-timing-function: {timingFunction};
                "
                bind:this={particlesContainer}
            >
                <!-- <slot {loaded} {currentPageIndex} {pagesCount} /> -->
                {@render renderItems?.({ currentPageIndex, pagesCount, loaded, goTo, goToPrev, goToNext })}
            </div>
            {#if autoplayProgressVisible}
                <div class="sc-carousel-progress__container">
                    <Progress value={progressValue} />
                </div>
            {/if}
        </div>
        {#if arrows}
            {#if renderNext}
                {@render renderNext({ currentPageIndex, pagesCount, loaded, goTo, goToPrev, goToNext })}
            {:else}
                <div class="sc-carousel__arrow-container">
                    <Arrow
                        direction="next"
                        disabled={!infinite && currentPageIndex === pagesCount - 1}
                        onclick={methods.showNextPage}
                    />
                </div>
            {/if}
        {/if}
    </div>
    {#if dots}
        {#if renderDots}
            {@render renderDots({ currentPageIndex, pagesCount, loaded, goTo, goToPrev, goToNext })}
        {:else}
            <Dots
                {pagesCount}
                {currentPageIndex}
                onPageChange={(n) => handlePageChange(n)}
            ></Dots>
        {/if}
    {/if}
</div>

<style>
    :root {
        --sc-color-rgb-light-50p: rgba(93, 93, 93, 0.5);
        --sc-color-rgb-light: #5d5d5d;
        --sc-color-hex-dark-50p: rgba(30, 30, 30, 0.5);
        --sc-color-hex-dark: #1e1e1e;
    }
    .sc-carousel__carousel-container {
        display: flex;
        width: 100%;
        flex-direction: column;
        align-items: center;
    }
    .sc-carousel__content-container {
        position: relative;
        display: flex;
        width: 100%;
    }
    .sc-carousel__pages-window {
        flex: 1;
        display: flex;
        overflow: hidden;
        box-sizing: border-box;
        position: relative;
    }
    .sc-carousel__pages-container {
        width: 100%;
        display: flex; /* to put child elements in one row */
        transition-property: transform;
    }
    .sc-carousel__arrow-container {
        padding: 5px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .sc-carousel-progress__container {
        width: 100%;
        height: 5px;
        background-color: var(--sc-color-rgb-light-50p);
        position: absolute;
        bottom: 0;
    }
    :global(.sc-carousel-button) {
        all: unset;
        cursor: pointer;
    }
    :global(.sc-carousel-button:focus) {
        outline: 5px auto;
    }
    :global(img) {
        -webkit-user-drag: none;
    }
</style>
