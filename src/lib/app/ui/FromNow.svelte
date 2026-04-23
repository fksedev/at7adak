<script lang="ts">
    import { fromNowTiny } from "$lib/app";
    import { onDestroy, onMount } from "svelte"

    let { timestamp } = $props()
    let value = $state()
    let interval
    const process = () => {
        value = fromNowTiny(timestamp)
        interval = setTimeout(process, 1000)
    }

    process()

    onDestroy(() => { clearTimeout(interval) })
</script>

<div>{value}</div>
