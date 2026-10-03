<script lang="ts">
	import {
		Icon,
		cn,
		downloads,
		appStoreReady,
		androidReady,
		apkDownloadFileName,
		type ApkPublicMeta
	} from '$lib/front'

	let {
		dark = true,
		className = '',
		size = 'md' as 'md' | 'lg',
		detailed = false,
		/** Live APK meta from server (apk-meta.json). Falls back to disabled Android button. */
		apk = null as ApkPublicMeta | null
	} = $props()

	const iosOk = $derived(appStoreReady())
	const androidOk = $derived(androidReady(apk))
	const version = $derived(apk?.version ?? '—')
	const buildNumber = $derived(apk?.buildNumber ?? '—')
	const sizeLabel = $derived(apk?.sizeLabel ?? '—')
	const updatedAt = $derived(apk?.updatedAt ?? '—')
	const androidMin = $derived(apk?.androidMin ?? downloads.androidMin)
	const apkHref = $derived(apk?.apkUrl ?? downloads.apkUrl)
	const apkFileName = $derived(
		apk?.downloadFileName ?? apkDownloadFileName(version, buildNumber)
	)

	const btnBase = $derived(
		cn(
			'rounded-xl flex gap-2.5 items-center justify-center transition-all duration-300 trans w-full',
			size === 'lg' || detailed ? 'px-5 py-3.5' : 'px-4 py-1.5'
		)
	)

	const btnDark = $derived(
		dark
			? 'bg-black hover:bg-white/10 text-white border border-white/20 fill-white'
			: 'bg-white text-dark hover:bg-white/90'
	)

	const androidBtn = 'bg-black text-white border-2 border-green hover:bg-green/10 fill-white'
	const pending = 'opacity-50 cursor-not-allowed'
</script>

{#if detailed}
	<div class={cn('grid md:grid-cols-2 gap-5', className)}>
		<div class="space-y-2">
			{#if iosOk}
				<a
					href={downloads.appStoreUrl}
					target="_blank"
					rel="noopener noreferrer"
					class={cn(btnBase, btnDark)}
				>
					<Icon size={28} name="logos:apple" />
					<div class="py-0.5 flex flex-col pr-1 text-left flex-1">
						<span class="text-[10px] font-normal opacity-80">Download on the</span>
						<span class="-mt-0.5 text-base font-semibold">App Store</span>
					</div>
				</a>
			{:else}
				<span class={cn(btnBase, btnDark, pending)} title="App Store link pending">
					<Icon size={28} name="logos:apple" />
					<div class="py-0.5 flex flex-col pr-1 text-left flex-1">
						<span class="text-[10px] font-normal opacity-80">Download on the</span>
						<span class="-mt-0.5 text-base font-semibold">App Store</span>
					</div>
				</span>
			{/if}
			<p class="text-xs text-white/55 leading-relaxed px-1">
				{downloads.iosMin} · {downloads.iosDevices}<br />
				{downloads.iosAvailability}
			</p>
		</div>

		<div class="space-y-2">
			{#if androidOk}
				<a
					href={apkHref}
					download={apkFileName}
					rel="noopener noreferrer"
					class={cn(btnBase, androidBtn)}
				>
					<Icon size={28} name="logos:android-icon" />
					<div class="py-0.5 flex flex-col pr-1 text-left flex-1">
						<span class="text-[10px] font-normal opacity-80">Download for</span>
						<span class="-mt-0.5 text-base font-semibold">Android (APK)</span>
					</div>
					<Icon size={20} name="mdi:download" />
				</a>
			{:else}
				<span class={cn(btnBase, androidBtn, pending)} title="APK not published yet">
					<Icon size={28} name="logos:android-icon" />
					<div class="py-0.5 flex flex-col pr-1 text-left flex-1">
						<span class="text-[10px] font-normal opacity-80">Download for</span>
						<span class="-mt-0.5 text-base font-semibold">Android (APK)</span>
					</div>
					<Icon size={20} name="mdi:download" />
				</span>
			{/if}
			<p class="text-xs text-white/55 leading-relaxed px-1">
				{androidMin}<br />
				Version {version} · Build {buildNumber} · {sizeLabel}<br />
				Updated: {updatedAt}
			</p>
		</div>
	</div>
{:else}
	<div class={cn('py-4 sm:py-6 px-0 sm:px-3 overflow-x-auto scrollbar-hide', className)}>
		<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center w-full">
			{#if iosOk}
				<a
					href={downloads.appStoreUrl}
					target="_blank"
					rel="noopener noreferrer"
					class={cn(btnBase, btnDark, size === 'lg' ? 'sm:min-w-52' : '')}
				>
					<Icon size={size === 'lg' ? 28 : 20} name="logos:apple" />
					<div class="py-0.5 flex flex-col pr-1 text-left">
						<span class="text-xs sm:text-[10px] font-normal opacity-80">Download on the</span>
						<span class="-mt-0.5 text-sm sm:text-base font-semibold">App Store</span>
					</div>
				</a>
			{:else}
				<span
					class={cn(btnBase, btnDark, pending, size === 'lg' ? 'sm:min-w-52' : '')}
					title="App Store link pending"
				>
					<Icon size={size === 'lg' ? 28 : 20} name="logos:apple" />
					<div class="py-0.5 flex flex-col pr-1 text-left">
						<span class="text-xs sm:text-[10px] font-normal opacity-80">Download on the</span>
						<span class="-mt-0.5 text-sm sm:text-base font-semibold">App Store</span>
					</div>
				</span>
			{/if}

			{#if androidOk}
				<a
					href={apkHref}
					download={apkFileName}
					rel="noopener noreferrer"
					class={cn(btnBase, androidBtn, size === 'lg' ? 'sm:min-w-52' : '')}
				>
					<Icon size={size === 'lg' ? 28 : 20} name="logos:android-icon" />
					<div class="py-0.5 flex flex-col pr-1 text-left">
						<span class="text-xs sm:text-[10px] font-normal opacity-80">Download for</span>
						<span class="-mt-0.5 text-sm sm:text-base font-semibold">Android (APK)</span>
					</div>
					<Icon size={18} name="mdi:download" />
				</a>
			{:else}
				<span
					class={cn(btnBase, androidBtn, pending, size === 'lg' ? 'sm:min-w-52' : '')}
					title="APK not published yet"
				>
					<Icon size={size === 'lg' ? 28 : 20} name="logos:android-icon" />
					<div class="py-0.5 flex flex-col pr-1 text-left">
						<span class="text-xs sm:text-[10px] font-normal opacity-80">Download for</span>
						<span class="-mt-0.5 text-sm sm:text-base font-semibold">Android (APK)</span>
					</div>
				</span>
			{/if}
		</div>
	</div>
{/if}
