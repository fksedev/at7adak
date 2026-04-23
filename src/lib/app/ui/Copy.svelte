<script lang="ts">
    import { Icon, toast } from "$lib/app"

    let { text, className = '', withIcon = false, children } = $props()

    const copy = () => {
        navigator.clipboard.writeText(text).then(
            () => toast.success('Text copied to your clipboard!'),
            (e) => toast.error('Something went wrong!')
        );
    };
</script>

<button onclick={copy} class="cursor-pointer flex gap-1 items-center {className}">
    {@render children?.()}
    {#if withIcon}
        <div class="opacity-65">
            <Icon name="iconoir:copy" size={16} />
        </div>
    {/if}
</button>
