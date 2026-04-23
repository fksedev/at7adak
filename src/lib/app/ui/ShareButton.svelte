<script lang="ts">
    import type { Snippet } from "svelte"

    let { 
        url, 
        title = "Check this out",
        className,
        children
    }: { 
        url: string,
        title?: string,
        className?: string,
        children: Snippet
    } = $props()

    async function share() {
        const shareData: ShareData = { url, title }

        if (navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData)
            } catch (err) {
                console.error(err)
            }
        } else {
            try {
                await navigator.clipboard.writeText(url)
            } catch (err) {
                console.error("Failed to copy: ", err)
            }
        }
    }
</script>

<button onclick={share} class={className}>
    {@render children?.()}
</button>
