<script lang="ts">
	import Confetti from './Confetti.svelte';
	import type { OnCreateParticle, OnUpdateParticle, ParticleStyle, Position } from './utils';

	let {
		origin,
		styles = undefined,
		particleCount = 50,
		force = 15,
		angle = -90,
		spread = 360,
		onCompleted,
		onCreate,
		onUpdate,
	}: {
		origin: Position,
		styles?: ParticleStyle[] | undefined,
		particleCount?: number,
		force?: number,
		angle?: number,
		spread?: number,
		onCompleted?: () => void,
		onCreate?: OnCreateParticle | undefined,
		onUpdate?: OnUpdateParticle | undefined
	} = $props()
</script>

<Confetti
	{particleCount}
	{origin}
	{force}
	{spread}
	{angle}
	{styles}
	{onCreate}
	{onUpdate}
	{onCompleted}
/>
