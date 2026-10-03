<script lang="ts">
	import { Icon, cn } from '$lib/front'

	let {
		size = 24,
		className = '',
		compact = false
	}: {
		size?: number
		className?: string
		compact?: boolean
	} = $props()

	const items = [
		{
			url: 'https://www.facebook.com/share/1CVznhhRJZ',
			icon: 'tabler:brand-facebook',
			label: 'Facebook'
		},
		{
			url: 'https://www.instagram.com/at7adak.app',
			icon: 'tabler:brand-instagram',
			label: 'Instagram'
		},
		{
			url: 'https://x.com/At7adak_App',
			icon: 'tabler:brand-x',
			label: 'X'
		},
		{
			url: 'https://discord.gg/nhapgHRz6Y',
			icon: 'tabler:brand-discord',
			label: 'Discord'
		},
		{
			url: 'https://www.tiktok.com/@at7adak.app',
			icon: 'tabler:brand-tiktok',
			label: 'TikTok'
		}
	]
</script>

<div class={cn('flex items-center', compact ? 'gap-1.5' : 'gap-2', className)}>
	{#each items as item}
		<a
			href={item.url}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={item.label}
			class="trans opacity-70 hover:opacity-100 text-white"
		>
			<Icon name={item.icon} size={size} />
		</a>
	{/each}
</div>
