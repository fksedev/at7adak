<script lang="ts">
    import { Input, Radio, toast } from "$lib/dashboard";
    import type { PageData } from "./$types"
    import { enhance } from "$app/forms"

    import { onMount } from "svelte"

    let { data }: { data: PageData } = $props();
    // svelte-ignore state_referenced_locally
    let opts = $state(data?.opts)
    let loading = $state(false)
    let loadingSend = $state(false)
    let mounted = $state(false)

    onMount(() => { 
        opts = data?.opts
        mounted = true 
    })
</script>

{#if mounted}
    <form method="post" action="?/save" class="mb-6"
        use:enhance={() => {
            loading = true
            return async () => {
                loading = false
                toast.success('SMTP saved')
            }
        }}
    >
        <div class="fieldset">
            <main>
            <div class="py-2 flex flex-col gap-4 dark:text-gray-200">
                <div class="text-2xl">SMTP</div>

                <Input 
                    type="email"
                    name="smtp_email"
                    bind:value={opts.smtp_email}
                    placeholder="Email Address"
                />

                <Input 
                    name="smtp_name"
                    bind:value={opts.smtp_name}
                    placeholder="From Name"
                />

                <Radio 
                    name="smtp_enc_type"
                    label="Encryption Type"
                    bind:value={opts.smtp_enc_type}
                    options={[
                        {label: 'None', value: ''},
                        {label: 'SSL', value: 'ssl'},
                        {label: 'TLS', value: 'tls'},
                    ]}
                />

                <Input 
                    placeholder="SMTP Host" 
                    name="smtp_host" 
                    bind:value={opts.smtp_host} 
                />

                <Input 
                    placeholder="SMTP Port" 
                    name="smtp_port" 
                    bind:value={opts.smtp_port} 
                    help="NONE: 25, SSL: 465, TLS: 587"
                />

                <Input 
                    placeholder="SMTP Username" 
                    name="smtp_username" 
                    type="email" 
                    bind:value={opts.smtp_username} 
                />

                <Input 
                    placeholder="SMTP Password" 
                    name="smtp_password" 
                    type="password" 
                    bind:value={opts.smtp_password} 
                />

            </div>
            </main>
            <footer class="flex justify-end place-items-center">
                <button type="submit" class:loading class="btn w-auto">Save</button>
            </footer>
        </div>
    </form>
{/if}
        
            
<form method="post" action="?/send"
    use:enhance={({ formData, formElement }) => {
        loadingSend = true
        return async ({ result, update }) => {
            loadingSend = false
            if(result.type === 'success'){
                formElement.reset()
                // @ts-ignore
                toast.success((result.data.res).toString())
            } 
            if(result.type === 'failure'){
                // @ts-ignore
                toast.error((result.data.res).toString())
            }
            await update()
        }
    }}
>
    <div class="fieldset">
        <main>
            <div class="py-2 flex flex-col gap-2 dark:text-gray-200">
                <div class="text-2xl">Send Test Email</div>
                <Input placeholder="Email Address" name="email" type="email" />
            </div>
        </main>

        <footer class="flex justify-end place-items-center">
            <button type="submit" class:loading={loadingSend} class="btn w-auto">SEND TEST EMAIL</button>
        </footer>
    </div>
</form>
