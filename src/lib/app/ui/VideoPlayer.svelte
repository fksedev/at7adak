<script lang="ts">
    import { onMount } from "svelte";
    import { cn } from "$lib/app"

    let mediaType = $state('mp4')

    let currentTime = $state(0)
    let duration = $state(0)
    let buffered = $state([])
    let played = $state([])
    let seeking = $state()
    let ended = $state(false)
    let paused = $state(true)
    let volume = $state(0)

    let {
        src,
        loop = true,
        autoplay = true,
        className = "",
        ...rest
    } = $props()

    // export let playbackRate = 1.0

    let el

    $effect(() => {
        mediaType = src.split('.').pop()

        if (ended) {
            currentTime = 0;
            if (loop) el.play();
        }
    })

    onMount(() => {
        el.load();
        el.autoplay = autoplay
        el.play()
    })
</script>

<video 
    muted defaultmuted loop playsinline
    bind:this={el} 
    bind:currentTime
    bind:duration
    bind:buffered
    bind:seeking
    bind:played
    bind:ended
    bind:paused
    bind:volume
    class={cn("object-cover bg-black", className)}
    onplay={(e) => {
        if (el && el !== e.target) el.pause();
        el = e.target;
    }}
    {...rest}
>
    <source src={src} type={`video/${mediaType}`} />
</video>
