<script lang="ts">
    import Dot from "../Dot/Dot.svelte"

    let {
        pagesCount = 1,
        currentPageIndex = 0,
        onPageChange,
    }: {
        pagesCount?: number
        currentPageIndex?: number
        onPageChange?: (n: number) => void
    } = $props()
</script>

<div class="sc-carousel-dots__container">
    {#each Array(pagesCount) as _, pageIndex (pageIndex)}
        <div class="sc-carousel-dots__dot-container">
            <Dot
                active={currentPageIndex === pageIndex}
                onclick={() => onPageChange?.(pageIndex)}
            ></Dot>
        </div>
    {/each}
</div>

<style>
    .sc-carousel-dots__container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        padding: 0 30px;
    }
    .sc-carousel-dots__dot-container {
        height: calc(var(--sc-dot-size) + 14px);
        width: calc(var(--sc-dot-size) + 10px);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
