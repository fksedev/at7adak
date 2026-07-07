<script lang="ts">
    import { Icon } from "$lib/front"

    const items = [
        {
            url: 'https://www.facebook.com/share/1CVznhhRJZ',
            icon: 'tabler:brand-facebook'
        },
        {
            url: 'https://www.instagram.com/at7adak.app',
            icon: 'tabler:brand-instagram'
        },
        {
            url: 'https://x.com/At7adak_App',
            icon: 'tabler:brand-x'
        },
        {
            url: 'https://discord.gg/nhapgHRz6Y',
            icon: 'tabler:brand-discord'
        },
        {
            url: 'https://www.tiktok.com/@at7adak.app',
            icon: 'tabler:brand-tiktok'
        },
    ]
</script>

<div class="flex-center gap-2">
    {#each items as item}
        <a href={item.url} target="_blank" class="trans opacity-60 hover:opacity-100">
            <Icon name={item.icon} size={24} />
        </a>
    {/each}
</div>
