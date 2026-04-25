<script lang="ts">
    import { Toaster } from '$lib/app'
	import './layout.css';

	let { children } = $props();
</script>

{@render children()}

<Toaster />
