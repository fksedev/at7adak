<script lang="ts">
    import { createElement } from "react"
    import { createRoot } from "react-dom/client"
    import { onMount, onDestroy } from "svelte"
    let container = $state()
    let reactRoot = $state<any>()
    const { component, children = null, ...props } = $props()

    onMount(() => {
        reactRoot = createRoot(container)
    })

    $effect(() => {
        reactRoot.render(createElement(component, props, children))
    })
    
    onDestroy(() => {
        reactRoot?.unmount()
    })
</script>

<div bind:this={container}></div>
