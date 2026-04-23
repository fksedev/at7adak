<script lang="ts">
    let {
        text,
        duration = 10,
        className = '',
        style = '',
        reverse = false,
        radius = 5.8,
    }: {
        text: string | string[];
        duration?: number;
        className?: string;
        style?: string;
        reverse?: boolean;
        radius?: number;
    } = $props()

    const letters = $derived.by(() => {
        if (Array.isArray(text)) text = text.join("")
        return [...text.split(""), " "]
    })
</script>

<div
    class="spinning-text {className} {reverse ? 'reverse' : ''}"
    style="--duration: {duration}s; {style}"
>
    {#each letters as letter, index}
        <span
            aria-hidden="true"
            class="letter"
            style="
                --index: {index};
                --total: {letters.length};
                --radius: {radius};
                transform:
                translate(-50%, -50%)
                rotate(calc(360deg / var(--total) * var(--index)))
                translateY(calc(var(--radius, 7) * -1ch));
            "
        >
            {letter}
        </span>
    {/each}
</div>

<style>
    .spinning-text {
        position: relative;
        animation: spin var(--duration, 10s) linear infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .spinning-text.reverse {
        animation-direction: reverse;
    }

    .letter {
        position: absolute;
        left: 50%;
        top: 50%;
        transform-origin: center;
    }
</style>
