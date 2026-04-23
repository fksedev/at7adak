<script lang="ts">
    import { Icon, cn } from "$lib/app"

    let { loading = false, onclick = () => null, size = 18, className = '' } = $props()
</script>

<button 
    class={cn("text-pink hover:text-white", className)}
    class:animate-spin={loading}
    onclick={() => onclick?.()}
>
    <Icon name="solar:refresh-broken" size={size} />
</button>
