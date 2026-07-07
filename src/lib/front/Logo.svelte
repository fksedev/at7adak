<script lang="ts">
    import { cn } from "$lib/front"
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
