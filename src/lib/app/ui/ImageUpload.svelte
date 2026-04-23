<script lang="ts">
    import { processImg, cn, proxy } from "$lib/app"
    let {
        image = $bindable(),
        blob = $bindable(),
        placeholder = 'Upload Image',
        className = ''
    } = $props()

    let imgInput

    const process = async (e) => {
        const { base64, blobData } = await processImg(e)
        image = base64
        blob = blobData
    }
</script>

<button type="button"
    onclick={ () => imgInput.click() }
    class={cn("relative border border-gray-700 w-40 h-40 flex items-center justify-center  rounded-full", className)}
>
    <input 
        type="file" 
        class="hidden"
        accept="image/*"
        bind:this={imgInput} 
        onchange={e => process(e)} 
    />

    {#if image}
        <img src={proxy(image)} alt="uploaded" class="w-full h-full rounded-full object-cover">
    {:else}
        {@html placeholder}
    {/if}

</button>
