<script lang="ts">
    let {
        count,
        index = 0,
        maxDots = 5,
        size = 6,
        spacing = 2,
        color = '#fff',
        className = '',
    }: {
        count?: number,
        index?: number,
        maxDots?: number,
        size?: number,
        spacing?: number,
        color?: string,
        className?: string,
    } = $props()
    
    let translateX = $derived((count! <= maxDots) ? 0 : Math.min(Math.max(index-2, 0), count! - maxDots) * (size + spacing * 2) * -1)
    let maxWidth = $derived(`calc(${maxDots} * calc(${size}px + ${spacing*2}px))`)
</script>

<div
    class="z-10 w-auto pointer-events-none overflow-hidden {className}"
    style={`max-width: ${maxWidth};`}
>
    <ul
        class="flex items-center transition-all duration-200"
        style={`transform: translateX(${translateX}px);`}
    >
        {#each Array(count) as el, i}
            {@const adjacent = i === index - 1 || i === index + 1}
            {@const current = i === index}
            {@const rest = !current && !adjacent}
            <li
                style:width={`${size}px`}
                style:height={`${size}px`}
                style:margin-left={`${spacing}px`}
                style:margin-right={`${spacing}px`}
                style:background-color={`${color}`}
                class="rounded-full shrink-0 transition-all duration-200"
                class:opacity-100={current}
                class:scale-100={current}
                class:opacity-90={adjacent}
                class:scale-[.8]={adjacent}
                class:opacity-[.65]={rest}
                class:scale-[.65]={rest}
            ></li>
        {/each}
    </ul>
</div>
