<script lang="ts">
    import { cn } from "$lib/app"
    import { onMount } from "svelte"
    import { fly } from "svelte/transition"

    let {
        words,
        duration = 2100,
        className = '',
    }: {
        words?: string[],
        duration?: number,
        className?: string,
    } = $props()

    let index = $state<number>(0)

    let chnageIndex = () => index = (index + 1) % words.length
    
    onMount(() => {
        let interval = setInterval(chnageIndex, duration)
        return () => clearInterval(interval)
    })
</script>

<div class="overflow-hidden py-2">
    {#key index}
        <h1
            in:fly={{ y: -50, delay: 200 }}
            out:fly={{ y: 40, duration: 200 }}
            class={cn(className, "text-center")}
        >
            {words[index]}
        </h1>
    {/key}
</div>
