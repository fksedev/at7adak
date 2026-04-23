<script lang="ts">
    let {
        direction = "next",
        disabled = false,
        onclick,
    }: {
        direction?: "next" | "prev"
        disabled?: boolean
        onclick?: () => void
    } = $props()
</script>

<button
    aria-label={`carousel-direction`}
    class="sc-carousel-button sc-carousel-arrow__circle"
    class:sc-carousel-arrow__circle_disabled={disabled}
    onclick={() => onclick?.()}
>
    <i
        class="sc-carousel-arrow__arrow"
        class:sc-carousel-arrow__arrow-next={direction === 'next'}
        class:sc-carousel-arrow__arrow-prev={direction === 'prev'}
    ></i>
</button>

<style>
    :root {
        --sc-arrow-size: 2px;
    }
    .sc-carousel-arrow__circle {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: var(--sc-color-rgb-light-50p);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 100ms ease;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }
    .sc-carousel-arrow__circle:hover {
        opacity: 0.9;
    }
    .sc-carousel-arrow__arrow {
        border: solid var(--sc-color-hex-dark);
        border-width: 0 var(--sc-arrow-size) var(--sc-arrow-size) 0;
        padding: var(--sc-arrow-size);
        position: relative;
    }
    .sc-carousel-arrow__arrow-next {
        transform: rotate(-45deg);
        left: calc(var(--sc-arrow-size) / -2);
    }
    .sc-carousel-arrow__arrow-prev {
        transform: rotate(135deg);
        right: calc(var(--sc-arrow-size) / -2);
    }
    .sc-carousel-arrow__circle_disabled,
    .sc-carousel-arrow__circle_disabled:hover {
        opacity: 0.5;
    }
</style>
