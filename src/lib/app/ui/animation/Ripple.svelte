<script lang="ts">
    let {
        size = 210,
        opacity = 0.24,
        number = 8,
    }: {
        size?: number
        opacity?: number
        number?: number
    } = $props()
</script>

<div
    class="absolute inset-0 flex items-center justify-center bg-white/5 mask-[linear-gradient(to_bottom,white,transparent)]"
>
    {#each { length: number } as _, i}
        <div
            class="absolute animate-ripple rounded-full bg-foreground/30 shadow-xl border top-1/2 left-1/2 translate-x-1/2 translate-y-1/2 [--i:{i}]"
            style="width: {size + i * 70}px;
         height: {size + i * 70}px;
         opacity: {opacity - i * 0.03}; 
         animation-delay: {i * 0.08}s;
         border-style:{i === number - 1 ? 'dashed' : 'solid'};
         border-width: 1px;
         border-color: rgba(var(--foreground-rgb), {(5 + i * 5) / 100});
        "
        ></div>
    {/each}
</div>
