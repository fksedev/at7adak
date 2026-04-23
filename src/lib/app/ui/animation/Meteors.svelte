<script lang="ts">
    import { cn } from "$lib/app"
    import { onMount } from "svelte"

    let { number = 10 } = $props()

    let meteorStyles = $state([])

    let changeMeteors = (num: number) => {
        meteorStyles = []
        const styles = [...new Array(num)].map(() => ({
            top: -20 + "px",
            left: Math.floor(Math.random() * window.innerWidth) + "px",
            animationDelay: Math.random() * 1 + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * 8 + 2.9) + "s",
        }))
        meteorStyles = styles
    }
    onMount(() => {
        changeMeteors(number)
    })
</script>

{#each meteorStyles as style}
    <span
        class="animate-meteor absolute size-[2.4px] rotate-145 rounded-full bg-slate-500"
        style:top={style.top}
        style:left={style.left}
        style:animation-delay={style.animationDelay}
        style:animation-duration={style.animationDuration}
    >
        <!-- Meteor Tail  -->
        <div
            class="absolute top-1/2 -z-10 h-px w-12.5 -translate-y-1/2 bg-linear-to-r from-slate-500 via-blue-600/30 to-transparent"
        ></div>
    </span>
{/each}

<style>
    .animate-meteor {
        animation: meteor 5s linear infinite;
    }
    @keyframes meteor {
        0% { 
            transform: rotate(145deg) translateX(0); 
            opacity: 1; 
        }
        70% { 
            opacity: 1; 
        }
        100% {
            transform: rotate(145deg) translateX(-500px);
            opacity: 0;
        }
    }
</style>
