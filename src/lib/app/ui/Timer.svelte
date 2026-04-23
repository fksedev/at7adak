<script lang="ts">
    import { onDestroy, onMount } from "svelte"
    import { LoadingDots } from "$lib/app"
    let { 
        countdown, 
        onend,
        withLoader = false,
        className = '' 
    }: { 
        countdown: number; 
        onend?: () => void;
        withLoader?: boolean;
        className?: string; 
    } = $props()

    let now = $state(Date.now())
    let end = $derived(Date.now() + countdown * 1000)
    let count = $state<number | undefined>(undefined)
    let h = $state(0)
    let m = $state(0)
    let s = $state(0)

    let interval

    const updateTimer = () => {
        now = Date.now();
        count = Math.round((end - now) / 1000)
        h = Math.floor(count / 3600);
        m = Math.floor((count - h * 3600) / 60);
        s = count - h * 3600 - m * 60;
    }

    const handleStart = () => {
        now = Date.now();
        end = now + countdown * 1000;
        updateTimer()
        interval = setInterval(updateTimer, 1000);
    }

    const padValue = (value, len = 2, char = '0') => {
        const { length } = value.toString();
        if (length >= len) return value.toString();
        return `${char.repeat(len - length)}${value}`;
    }

    $effect(() => {
        if (count === 0) {
            clearInterval(interval)
            onend?.()
        }
    })

    onMount(() => { handleStart() })
    onDestroy(() => { clearInterval(interval) })
</script>

{#if count}
    <div class="flex items-center gap-2 {className}">
        {#if withLoader}
            <LoadingDots />
        {/if}
        
        {#each Object.entries({ h, m, s }) as [key, value], i}
            {#if countdown >= 60 ** (2 - i)}
                <div>
                    <span>{padValue(value)}</span>
                    <span class="opacity-65">{key}</span>
                </div>
            {/if}
        {/each}
    </div>
{/if}
