<script lang="ts" module>
	import type {
		OnCreateParticle,
		OnUpdateParticle,
		Particle,
		ParticleStyle,
		Position
	} from './utils';
	import { COLORS, createParticle, isOutOfBounds, renderParticle, updateParticle } from './utils';

	const renderParticles = (context: CanvasRenderingContext2D, particles: Particle[]) => {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		for (let i = 0; i < particles.length; ++i) {
			renderParticle(context, particles[i]);
		}
	};

	const updateParticles = (
		context: CanvasRenderingContext2D,
		particles: Particle[],
		dt: number,
		onUpdate?: OnUpdateParticle
	) => {
		let livingParticles = particles.length;

		for (let i = 0; i < particles.length; ++i) {
			const p = particles[i];
			if (p.dead) {
				livingParticles--;
			} else {
				updateParticle(p, dt);
				if (isOutOfBounds(context, p)) p.dead = true;
				if (onUpdate) onUpdate(p, dt);
			}
		}

		return livingParticles > 0;
	};

	const start = (
		canvas: HTMLCanvasElement,
		onCompleted: () => void,
		particleCount: number,
		origin: Position | undefined,
		force: number,
		angle: number,
		spread: number,
		styles: (HTMLImageElement | string)[],
		onCreate?: OnCreateParticle,
		onUpdate?: OnUpdateParticle
	) => {
		const context = canvas.getContext('2d');
		if (!context) throw new Error('No context?');

		const particles: Particle[] = Array.from({ length: particleCount }, () =>
			createParticle(context, origin, force, angle, spread, styles, onCreate)
		);

		let frameId: number, t: number;

		const run = (_t: number) => {
			renderParticles(context, particles);
			const stillRunning = updateParticles(context, particles, (_t - t) / 1e3, onUpdate);
			if (stillRunning) {
				t = _t;
				frameId = requestAnimationFrame(run);
			} else {
				onCompleted();
			}
		};

		t = performance.now();
		frameId = requestAnimationFrame(run);

		return () => {
			cancelAnimationFrame(frameId);
		};
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let {
		styles = COLORS,
		particleCount = 50,
		origin = undefined,
		force = 15,
		angle = 0,
		spread = 360,
		onCompleted,
		onCreate,
		onUpdate,
	}: {
		styles?: ParticleStyle[],
		particleCount?: number,
		origin?: Position | undefined
		force?: number,
		angle?: number,
		spread?: number,
		onCompleted?: () => void,
		onCreate?: OnCreateParticle | undefined,
		onUpdate?: OnUpdateParticle | undefined
	} = $props()

	let canvas: HTMLCanvasElement;
	let w = $state<number>(0)
	let h = $state<number>(0)

	onMount(() => {
		canvas.width = w;
		canvas.height = h;
		return start(
			canvas,
			() => onCompleted?.(),
			particleCount,
			origin,
			force,
			angle,
			spread,
			styles,
			onCreate,
			onUpdate
		);
	});
</script>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />

<canvas 
	bind:this={canvas} 
	width={w} 
	height={h}
	class="fixed top-0 left-0 size-full pointer-events-none z-999999"
></canvas>
