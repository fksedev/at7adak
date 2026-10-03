<script lang="ts">
	import { enhance } from '$app/forms'
	import { FrontHeader, FrontFooter, SeoSite } from '$lib/front'
	import type { ActionData, PageData } from './$types'

	let { data, form }: { data: PageData; form: ActionData } = $props()

	let unlocking = $state(false)
	let uploading = $state(false)
	let saving = $state(false)
</script>

<SeoSite
	title="APK Update – AT7ADAK"
	description="Upload a new AT7ADAK Android APK and update version metadata."
/>

<div class="relative min-h-screen">
	<FrontHeader />

	<div class="container max-w-2xl py-10 space-y-6">
		<div class="space-y-2">
			<h1 class="font-hero font-bold italic text-4xl md:text-5xl">
				APK <span class="text-green">Update</span>
			</h1>
			<p class="text-white/65 text-sm leading-relaxed">
				Upload a new signed Android build. The public
				<a href="/download" class="text-green underline underline-offset-2">Download page</a>
				updates automatically — no website code changes needed.
			</p>
		</div>

		{#if form?.message}
			<div
				class="rounded-xl border px-4 py-3 text-sm {form.ok
					? 'border-green/40 bg-green/10'
					: 'border-red/40 bg-red/10'}"
			>
				{form.message}
			</div>
		{/if}

		{#if !data.secretConfigured}
			<div class="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm space-y-2">
				<p>
					Add this to <code class="bg-black/40 px-1 rounded">.env</code> and restart
					<code class="bg-black/40 px-1 rounded">npm run dev</code>:
				</p>
				<pre class="bg-black/50 rounded-lg p-3 text-xs overflow-x-auto">APK_UPDATE_SECRET=choose-a-strong-password</pre>
			</div>
		{:else if !data.unlocked}
			<div class="rounded-2xl border border-white/10 bg-[#0c151e] p-6 space-y-4">
				<div class="font-semibold">Enter update password</div>
				<form
					method="POST"
					action="?/unlock"
					class="space-y-4"
					use:enhance={() => {
						unlocking = true
						return async ({ update }) => {
							await update()
							unlocking = false
						}
					}}
				>
					<input
						type="password"
						name="password"
						required
						placeholder="APK update password"
						class="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5"
						autocomplete="current-password"
					/>
					<button
						type="submit"
						disabled={unlocking}
						class="w-full bg-green text-black font-hero font-bold italic text-2xl py-2 rounded-lg disabled:opacity-50"
					>
						{unlocking ? 'Checking…' : 'Unlock'}
					</button>
				</form>
			</div>
		{:else}
			<div class="rounded-2xl border border-white/10 bg-[#0c151e] p-5 space-y-3">
				<div class="flex-between gap-3">
					<div class="font-semibold">Current live build</div>
					<form method="POST" action="?/lock">
						<button type="submit" class="text-xs opacity-60 hover:opacity-100 underline">
							Lock page
						</button>
					</form>
				</div>
				<div class="grid grid-cols-2 gap-3 text-sm">
					<div>
						<div class="text-xs text-white/45">Version</div>
						<div class="font-mono">{data.apk.version}</div>
					</div>
					<div>
						<div class="text-xs text-white/45">Build</div>
						<div class="font-mono">{data.apk.buildNumber}</div>
					</div>
					<div>
						<div class="text-xs text-white/45">Size</div>
						<div class="font-mono">{data.apk.sizeLabel}</div>
					</div>
					<div>
						<div class="text-xs text-white/45">Published</div>
						<div class={data.apk.apkReady ? 'text-green' : 'text-amber-400'}>
							{data.apk.apkReady ? 'Yes' : 'No'}
						</div>
					</div>
				</div>
				{#if data.apk.apkReady}
					<a href={data.apk.apkUrl} class="text-sm text-green underline" target="_blank">
						Test APK download → {data.apk.downloadFileName || `at7adak(${data.apk.version}+${data.apk.buildNumber}).apk`}
					</a>
				{/if}
			</div>

			<div class="rounded-2xl border border-white/10 bg-[#0c151e] p-6 space-y-4">
				<div class="font-hero font-bold italic text-2xl text-green">Upload new APK</div>
				<form
					method="POST"
					action="?/upload"
					enctype="multipart/form-data"
					class="space-y-4"
					use:enhance={() => {
						uploading = true
						return async ({ update }) => {
							await update()
							uploading = false
						}
					}}
				>
					<label class="block space-y-1">
						<span class="text-sm text-white/60">APK file</span>
						<input
							type="file"
							name="apk"
							accept=".apk,application/vnd.android.package-archive"
							required
							class="block w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-green file:text-black file:font-semibold"
						/>
					</label>

					<div class="grid sm:grid-cols-2 gap-4">
						<label class="block space-y-1">
							<span class="text-sm text-white/60">Version</span>
							<input
								type="text"
								name="version"
								required
								placeholder="1.0.1"
								value={data.apk.version}
								class="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5"
							/>
						</label>
						<label class="block space-y-1">
							<span class="text-sm text-white/60">Build number</span>
							<input
								type="text"
								name="buildNumber"
								required
								placeholder="21"
								value={data.apk.buildNumber}
								class="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5"
							/>
						</label>
					</div>

					<label class="block space-y-1">
						<span class="text-sm text-white/60">Android minimum</span>
						<input
							type="text"
							name="androidMin"
							value={data.apk.androidMin}
							class="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5"
						/>
					</label>

					<label class="flex items-center gap-2 text-sm">
						<input type="checkbox" name="publish" checked class="size-4 accent-green" />
						Publish on the website immediately
					</label>

					<button
						type="submit"
						disabled={uploading}
						class="w-full bg-green text-black font-hero font-bold italic text-2xl py-2.5 rounded-lg disabled:opacity-50"
					>
						{uploading ? 'Uploading…' : 'Upload & update website'}
					</button>
				</form>
			</div>

			<div class="rounded-2xl border border-white/10 bg-[#0c151e] p-6 space-y-4">
				<div class="font-semibold">Publish / hide (no re-upload)</div>
				<form
					method="POST"
					action="?/saveMeta"
					class="space-y-4"
					use:enhance={() => {
						saving = true
						return async ({ update }) => {
							await update()
							saving = false
						}
					}}
				>
					<div class="grid sm:grid-cols-2 gap-4">
						<label class="block space-y-1">
							<span class="text-sm text-white/60">Version</span>
							<input
								type="text"
								name="version"
								value={data.apk.version}
								class="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5"
							/>
						</label>
						<label class="block space-y-1">
							<span class="text-sm text-white/60">Build number</span>
							<input
								type="text"
								name="buildNumber"
								value={data.apk.buildNumber}
								class="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-2.5"
							/>
						</label>
					</div>
					<label class="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							name="publish"
							checked={data.apk.apkReady}
							class="size-4 accent-green"
						/>
						Show Android download on the website
					</label>
					<button
						type="submit"
						disabled={saving}
						class="border border-white/20 hover:bg-white/5 px-5 py-2.5 rounded-lg text-sm disabled:opacity-50"
					>
						{saving ? 'Saving…' : 'Save'}
					</button>
				</form>
			</div>
		{/if}
	</div>

	<FrontFooter />
</div>
