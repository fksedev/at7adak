<script lang="ts">
    import type { Snippet } from "svelte"

    let {
        data = $bindable(),
        onchange,
        className = '',
        children,
    }: {
        data?: any;
        onchange?: (data) => void;
        className?: string;
        children?: Snippet;
    } = $props()

    let input

    const process = async (e) => {
        const fr = new FileReader();
        fr.addEventListener("load", e => {
            // console.log(e.target.result, JSON.parse(fr.result.toString()))
            data = JSON.parse(fr.result.toString())
            onchange?.(data)
        });
        fr.readAsText(e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0]);
    }
</script>

<button type="button" aria-label="JSON Upload"
    onclick={ () => input.click() }
    class={className}
>
    <input 
        type="file" 
        class="hidden"
        accept="application/json"
        bind:this={input} 
        onchange={process} 
    />

    {@render children?.()}
</button>
