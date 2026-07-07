<script lang="ts">
    import { Input, fetcher } from "$lib/front"

    let value = $state('')
    let valid = $state(undefined)
    let loading = $state(false)

    const reset = () => {
        value = ''
        valid = undefined
    }

    const send = async () => {
        if(!valid) return alert('Invalid number')
        loading = true

        const res = await fetcher.post('/api/otp', {
            to: value,
        })

        if(res.ok && res.data.status === 200) {
            alert(`message delivered to ${value}`)
            reset()
        } else {
            alert(`Couldn't deliver to ${value}`)
        }

        loading = false
    }
    
</script>

<div class="min-h-svh flex-center bg-background">
    <div class="p-5 rounded-xl border space-y-5 min-w-xs">
    
        <div class="font-hero font-bold italic text-4xl text-center mb-4">
            Test <span class="text-green">OTP</span> deliverability
        </div>

        <Input 
            type='phone'
            label="Mobile"
            bind:value
            bind:valid
        />

        <button 
            class="font-hero font-bold italic text-3xl bg-green hover:bg-green/80 trans py-2 rounded-lg text-black w-full flex-center"
            disabled={loading}
            class:loading
            onclick={send}
        >
            Send OTP
        </button>
    </div>
</div>
