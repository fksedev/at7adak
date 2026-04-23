<script lang="ts">
	import Confetti from './Confetti.svelte';
	import type { OnCreateParticle, OnUpdateParticle, ParticleStyle } from './utils';
	let {
		styles = undefined,
		particleCount = 50,
		onCompleted,
		onCreate,
		onUpdate,
	}: {
		styles?: ParticleStyle[] | undefined,
		particleCount?: number,
		onCompleted?: () => void,
		onCreate?: OnCreateParticle | undefined,
		onUpdate?: OnUpdateParticle | undefined
	} = $props()
</script>

<Confetti {particleCount} {styles} {onCreate} {onUpdate} {onCompleted} />
