<script lang="ts">
	import { Icon } from '$lib/app';
    import { onDestroy, onMount } from 'svelte'

    type Data = {
        title: string;
        content: string;
        image?: string;
        video?: string;
        icon?: string;
    }

    let {
        data = [],
        duration = 6000,
        ltr = false,
        position = 'left',
    }: {
        data: Data[];
        duration?: number;
        ltr?: boolean;
        position?: "left" | "right" | "top" | "bottom"
    } = $props()

    let currentIndex = $state<number>(-1)
    let mounted = $state<boolean>(false)
    let carouselRef: HTMLDivElement

    const scrollToIndex = (index: number) => {
        if (!carouselRef) return
        const cards = carouselRef.querySelectorAll(".card_code")
        const card = cards[index] as HTMLElement

        if (card) {
            const cardRect = card.getBoundingClientRect()
            const carouselRect = carouselRef.getBoundingClientRect()
            const offset =
                cardRect.left -
                carouselRect.left -
                (carouselRect.width - cardRect.width) / 2

            carouselRef.scrollTo({
                left: carouselRef.scrollLeft + offset,
                behavior: "smooth",
            })
        }
    }

    let start

    const handleAutoScroll = (timestamp) => {
        if (start === undefined) start = timestamp;
        const elapsed = timestamp - start;
        if(elapsed >= duration) {
            currentIndex = currentIndex === data.length - 1 ? 0 : currentIndex + 1
            scrollToIndex(currentIndex)
            start = undefined
        } 
        if(mounted) requestAnimationFrame(handleAutoScroll)
    }

    const gotoIndex = (index: number) => {
        start = undefined
        currentIndex = index
    }

    onMount(() => {
        mounted = true
        gotoIndex(0)
        requestAnimationFrame(handleAutoScroll)
    })

    onDestroy(() => {
        mounted = false
    })
</script>

<section>
    <div class="container">
        <div class="mx-auto max-w-6xl">
            <div class="mx-auto my-12 grid h-full items-center gap-10 lg:grid-cols-2">
                <div class="order-1 hidden lg:order-0 lg:flex {ltr ? 'lg:order-2 lg:justify-end' : 'justify-start'}">
                    <div>
                        {#each data as item, index}
                            <div class="relative flex items-center mb-8 last:mb-0">
                                {#if position === "left" || position === "right"}
                                    <div
                                        class="absolute inset-y-0 h-full w-0.5 overflow-hidden rounded-lg bg-white/10 {position === 'right' ? 'left-auto right-0' : 'left-0 right-auto'}"
                                    >
                                        <div
                                            class="absolute left-0 top-0 w-full {currentIndex === index ? 'h-full' : 'h-0'} origin-top transition-all ease-linear bg-pink"
                                            style="transition-duration: {currentIndex === index ? `${duration}ms` : '0s'};"
                                        ></div>
                                    </div>
                                {/if}

                                {#if position === "top" || position === "bottom"}
                                    <div
                                        class="absolute inset-x-0 h-0.5 w-full overflow-hidden rounded-lg bg-white/10 {position === 'bottom' ? 'bottom-0' : 'top-0'}"
                                    >
                                        <div
                                            class="absolute left-0 {position === 'bottom' ? 'bottom-0' : 'top-0'} h-full {currentIndex === index ? 'w-full' : 'w-0'} origin-left transition-all ease-linear bg-pink"
                                            style=" transition-duration: {currentIndex === index ? `${duration}ms` : '0s'};"
                                        ></div>
                                    </div>
                                {/if}

                                {#if item.icon}
                                    <div
                                        class="item-box mx-2 flex size-12 shrink-0 items-center justify-center rounded-full bg-black/20 sm:mx-6"
                                    >
                                        <Icon name={item.icon} size={24} />
                                    </div>
                                {:else}
                                    <div class="w-12"></div>
                                {/if}

                                <button 
                                    type="button" 
                                    class="space-y-2 w-full select-none text-start"
                                    onclick={() => gotoIndex(index)}    
                                >
                                    <div class="text-4xl font-medium font-nova text-blue">
                                        {item.title}
                                    </div>
                                    <div class="text-[16px] w-96">
                                        {item.content}
                                    </div>
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>

                <div class="w-full {ltr && 'lg:order-1'}">
                    {#if data[currentIndex]?.image}
                        <img
                            src={data[currentIndex].image}
                            alt="feature"
                            class="aspect-video w-full rounded-xl border border-white/10 object-cover p-1 shadow-lg"
                        />
                    {:else if data[currentIndex]?.video}
                        <video
                            preload="auto"
                            src={data[currentIndex].video}
                            class="aspect-video w-full rounded-lg object-cover shadow-lg"
                            autoplay
                            loop
                            muted
                        ></video>
                    {:else}
                        <div class="aspect-video w-full rounded-xl border border-white/10 p-1"></div>
                    {/if}
                </div>

                <div
                    class="relative md:hidden pb-0.5 [-webkit-mask-image:linear-gradient(90deg,transparent,black_20%,white_80%,transparent)] [linear-gradient(90deg,transparent,black_20%,white_80%,transparent)] -mb-8"
                >
                    {#each data as _, index}
                        <div class="absolute inset-x-0 h-0.5 w-full overflow-hidden rounded-lg bg-neutral-300/30 top-0">
                            <div
                                class="absolute left-0 top-0 h-full {currentIndex === index ? 'w-full' : 'w-0'} origin-left  transition-all ease-linear bg-pink"
                                style="transition-duration: {currentIndex === index ? `${duration}ms` : '0s'};"
                            ></div>
                        </div>
                    {/each}
                </div>
                <div
                    bind:this={carouselRef}
                    class="relative flex h-full snap-x snap-mandatory flex-nowrap overflow-x-auto [-ms-overflow-style:none] [-webkit-mask-image:linear-gradient(90deg,transparent,black_20%,white_80%,transparent)] [linear-gradient(90deg,transparent,black_20%,white_80%,transparent)] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
                >
                    {#each data as item, index}
                        <button
                            class="w-full card_code relative mr-8 grid h-full max-w-full pl-2 shrink-0 items-start justify-center last:mr-0 select-none text-start"
                            onclick={() => gotoIndex(index)}
                            style="scroll-snap-align: center;"
                        >
                            <div class="px-5">
                                <div class="text-3xl font-medium font-nova text-blue">{item.title}</div>
                                <p class="mx-0 max-w-sm text-balance text-sm">
                                    {item.content}
                                </p>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .card_code {
        transition: all 0.3s ease;
    }
    .item-box {
        width: 3rem;
        height: 3rem;
    }
</style>
