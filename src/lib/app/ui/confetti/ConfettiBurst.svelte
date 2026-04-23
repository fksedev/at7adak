<script lang="ts">
	import Confetti from './Confetti.svelte';
	import type { OnCreateParticle, OnUpdateParticle, ParticleStyle, Position } from './utils';

	let {
		styles = undefined,
		particleCount = 50,
		origin,
		onCompleted,
		onCreate,
		onUpdate,
	}: {
		styles?: ParticleStyle[] | undefined,
		particleCount?: number,
		origin: Position,
		onCompleted?: () => void,
		onCreate?: OnCreateParticle | undefined,
		onUpdate?: OnUpdateParticle | undefined
	} = $props()
</script>

<Confetti 
	{origin} 
	{particleCount} 
	{styles} 
	{onCreate} 
	{onUpdate} 
	{onCompleted} 
/>
