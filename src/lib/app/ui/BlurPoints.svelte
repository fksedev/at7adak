<script lang="ts">
	import { cn } from '$lib/app';
    let { animated = false, className }: { animated?: boolean, className?: string } = $props()
</script>
<div
    class={cn("pointer-events-none fixed flex h-full w-full flex-col items-center justify-center", className)}
    class:animated
>
    <div
        class="container-a absolute -left-[90%] md:left-0 flex flex-col items-center justify-center gap-5 transition-all"
    >
        <div class="g1 bubble"></div>
        <div class="g2 bubble -translate-x-20"></div>
    </div>
    <div
        class="container-b absolute -right-[90%] md:right-0 flex items-center justify-center transition-all"
    >
        <div class="g3 bubble translate-x-20 hidden md:block"></div>
        <div class="g4 bubble"></div>
    </div>
</div>

<style>
    .g1 {
        --circle-size: 377px;
        --color-bubble-bg: #3b82f6;
    }
    .g2,
    .g3 {
        --circle-size: 236px;
    }
    .g3 {
        --color-bubble-bg: #3b82f6;
    }
    .g4 {
        --circle-size: 377px;
        --color-bubble-bg: #6c00a2;
    }
    .bubble {
        background: linear-gradient(
            113deg,
            rgba(177, 204, 249, 0.4) 5%,
            var(--color-bubble-bg) 1%
        );
        border-radius: 100%;
        filter: blur(78px);
        height: var(--circle-size);
        mix-blend-mode: var(--blending);
        opacity: 0.4;
        transform: translateZ(0);
        width: var(--circle-size);
    }

    .animated .container-a {
        animation: moveInCircle 45s linear infinite;
    }
    .animated .container-b {
        animation: moveInCircle2 45s linear infinite;
    }

    @keyframes moveInCircle {
        0%,
        100% {
            left: -5%;
            top: 20%;
        }

        10% {
            left: 0;
            top: 0;
        }
        25% {
            left: 60%;
            top: 0;
        }
        50% {
            left: 80%;
            top: 60%;
        }
        75% {
            left: 0;
            top: 80%;
        }
    }

    @keyframes moveInCircle2 {
        0%,
        100% {
            right: -10%;
            top: 40%;
        }
        10% {
            right: 0;
            top: 0;
        }
        25% {
            right: 60%;
            top: 0;
        }
        50% {
            right: 80%;
            top: 60%;
        }
        75% {
            right: 0;
            top: 80%;
        }
    }
</style>
