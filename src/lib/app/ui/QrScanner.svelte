<script lang="ts">
	import { Icon } from '$lib/app';
    import { Html5Qrcode } from 'html5-qrcode'
    import { onMount, tick } from 'svelte'

    let {
        show = $bindable(false),
        onscan,
    }: {
        show: boolean,
        onscan?: (decodedText) => void,
    } = $props()

    let html5Qrcode = $state<Html5Qrcode>()
    let width = $state<number>(250)
    let height = $state<number>(250)
    let _error = $state('')

    const start = async () => {
        _error = '' // reset
        html5Qrcode = new Html5Qrcode('app-qr-reader')

        await tick()

        html5Qrcode?.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: { width, height } },
            (decodedText, decodedResult) => {
                onscan?.(decodedText)
                stop()
            },
            (error) => _error = error,
        )
        .catch((error) => _error = error)
        
    }

    const stop = async () => {
        try {
            await html5Qrcode?.stop()
        } catch (error) {
            _error = error
        }
        show = false
    }

    onMount(() => {
        return () => {
            stop()
        }
    })

    $effect(() => {
        if(show) start()
    })
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

{#if show}
    <div class="fixed z-1001 inset-0 bg-gray-900">
        <div
            class="relative flex-center"
            style:width={width+'px'}
            style:height={height+'px'}
        >
            <div class="absolute inset-0">
                <div 
                    id="app-qr-reader"
                    style:width={width+'px'}
                    style:height={height+'px'}
                ></div>
            </div>
        
            <button 
                class="absolute top-4 right-4 size-10 rounded-full bg-black text-white flex-center"
                onclick={stop}
            >
                <Icon name={'lucide:x'} size={24} />
            </button>

            <div class="size-62 border-4 border-amber-400 rounded-lg animate-pulse"></div>

            {#if _error}
                <div class="absolute bottom-0 inset-x-0 flex-center p-4">
                    <div class="px-4 py-2 rounded-md border border-red bg-red/10 text-red font-medium text-sm">
                        {_error}
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/if}
