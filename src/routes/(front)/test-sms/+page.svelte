<script lang="ts">
    import { fetcher, toast } from "$lib/app"
    import { Input } from "$lib/front"

    let text = $state('')
    let value = $state('')
    let valid = $state(undefined)
    let loading = $state(false)

    const reset = () => {
        text = ''
        value = ''
        valid = undefined
    }

    const send = async () => {
        if(!valid) return toast.error('Invalid number')
        if(!text) return toast.error('Invalid text')
        loading = true

        const res = await fetcher.post('/api/sms', {
            to: value,
            text,
        })

        if(res.ok && res.data.status === 200) {
            toast.success(`message delivered to ${value}`)
            reset()
        } else {
            toast.error(`Couldn't deliver to ${value}`)
        }

        loading = false
    }
    
</script>

<div class="min-h-svh flex-center bg-background">
    <div class="p-5 rounded-xl border space-y-5 min-w-xs">
    
        <div class="font-hero font-bold italic text-4xl text-center mb-4">
            Test <span class="text-green">SMS</span> deliverability
        </div>

        <Input 
            type='phone'
            label="Mobile"
            bind:value
            bind:valid
        />

        <Input 
            type='textarea'
            placeholder="Insert SMS text"
            label="Text"
            bind:value={text}
        />

        <button 
            class="font-hero font-bold italic text-3xl bg-green hover:bg-green/80 trans py-2 rounded-lg text-black w-full flex-center"
            disabled={loading}
            class:loading
            onclick={send}
        >
            Send SMS
        </button>
    </div>
</div>
