<script lang="ts">
    import { gravatar, avatarSVG, validEmail } from "$lib/dashboard"

    let {
        size = 28,
        rounded = true,
        name,
        email = '',
        image = ''
    }: {
        size?: number,
        rounded?: boolean,
        name: string | null | undefined,
        email?: string | null | undefined,
        image?: string | null | undefined,
    } = $props()

    let _size = $derived(size+'px')
    let alt = $derived(`${name}'s avatar`)
</script>

<div 
    style={`width: ${_size}; height: ${_size};`}
    class="relative overflow-hidden"
    class:rounded-full={rounded}
>
    {#if image}
        <img {alt}
            src={image} 
            class="object-cover size-full"
            class:rounded-full={rounded}
        >
    {:else}
        <img {alt}
            src={avatarSVG(name, size, rounded)} 
            class:rounded-full={rounded}
        >
        {#if email && validEmail(email)}
            <img {alt}
                src={gravatar(email, {size: size * 2, fallback: 'blank'})} 
                class="absolute inset-0 z-1 object-cover"
                class:rounded-full={rounded}
            >
        {/if}
    {/if}
</div>
