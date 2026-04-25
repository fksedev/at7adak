<script lang="ts">
	import './styles.css';
	import { Toaster } from "$lib/dashboard"
	
	let { children } = $props();
</script>

{@render children()}

<Toaster />
