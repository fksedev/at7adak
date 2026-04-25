<script lang="ts">
    import { cn } from "$lib/dashboard"
    let {
        type = "grid",
        size = 8,
        color = "rgb(255 255 255 / 0.1)",
        className = '',
    }: {
        type?: 'grid' | 'dot',
        size?: number,
        color?: string,
        className?: string,
    } = $props()
</script>

{#if type ==='grid'}
    <div
        class={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
        style:background-image={`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='${size}' height='${size}' fill='none' stroke='${color}'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E")`}
    ></div>
{/if}

{#if type === 'dot'}
    <div
        class={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
        style:background-image={`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='${color}' cx='10' cy='10' r='1.6257413380501518'%3E%3C/circle%3E%3C/svg%3E")`}
    ></div>
{/if}
