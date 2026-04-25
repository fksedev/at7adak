<script lang="ts">
    import { cn } from "$lib/app"
    let { 
        className = "",
        alt = "At7adak"
    } = $props()
</script>

<img 
    src="/logo-trans.png" 
    alt={alt} 
    class={cn("object-fill", className)} 
/>
