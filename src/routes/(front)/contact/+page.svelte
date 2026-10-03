<script lang="ts">
	import { FrontHeader, FrontFooter, SeoSite, content } from '$lib/front'
</script>

<SeoSite
	title="Contact & Support – AT7ADAK"
	description="Contact AT7ADAK support. Operated by Tech District S.A.L., Lebanon."
/>

<div class="relative min-h-screen">
	<FrontHeader />
	<div class="container max-w-3xl py-10 md:py-16 space-y-6">
		<h1 class="font-hero font-bold italic text-4xl md:text-5xl">
			Contact / <span class="text-green">Support</span>
		</h1>
		<p class="text-white/65 text-sm">{content.operator}</p>
		<div class="rounded-2xl border border-white/10 bg-[#0c151e] p-6 space-y-4 text-sm text-white/75 leading-relaxed">
			<p>For account, download, payment, or dispute help, email us:</p>
			<p class="text-lg">
				<a class="text-green underline underline-offset-2" href="mailto:{content.supportEmail}"
					>{content.supportEmail}</a
				>
			</p>
			<p class="text-white/45 text-xs">18+ only. Terms apply.</p>
		</div>
	</div>
	<FrontFooter />
</div>
