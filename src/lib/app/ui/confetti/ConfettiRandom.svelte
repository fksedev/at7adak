<script lang="ts">
    import {tick} from 'svelte';
    import { random, type OnCreateParticle, type OnUpdateParticle, type ParticleStyle } from './utils'
    import ConfettiBurst from './ConfettiBurst.svelte'
    
    const sleep = async (ms: number) => {
        await new Promise((resolve) => setTimeout(resolve, ms))
    }

    let {
        open = $bindable(false), 
        count = 5,
		styles = undefined,
		particleCount = 50,
		onCompleted,
		onCreate,
		onUpdate,
	}: {
        open: boolean, 
        count?: number,
		styles?: ParticleStyle[] | undefined,
		particleCount?: number,
		onCompleted?: () => void,
		onCreate?: OnCreateParticle | undefined,
		onUpdate?: OnUpdateParticle | undefined
	} = $props()

    let confettiBurst = $state(false)

    const run = async () => {
        for(let i = 0; i < count; i++) {
            confettiBurst = false;
            await tick();
            confettiBurst = true;
            await sleep(450)
        }
        open = false
    }

    $effect(() => {
        if(open) {
            run()
        }
    })
</script>

{#if confettiBurst}
	<ConfettiBurst 
        origin={[
			random(window.innerWidth / 4 * 3, window.innerWidth / 4), 
			random(window.innerHeight / 4 * 3, window.innerHeight / 4)
		]} 
        {particleCount} 
        {styles} 
        {onCreate} 
        {onUpdate} 
        {onCompleted} 
	/>
{/if}
