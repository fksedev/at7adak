<script lang="ts">
    import { enhance } from "$app/forms"
    import { goto } from "$app/navigation"
    import { Input, toast, Drawer } from "$lib/dashboard"

    let {
        id,
        type = "project",
        action = '?/delete'
    } = $props()

    let title = $derived(`Delete ${type}`)
    let warning = $derived(`The ${type} will be permanently deleted. This action is irreversible and can not be undone.`)
    

    let modalOpen = $state(false)
    let inputId = $state('')
    let inputVerify = $state('')
    let verifyText = $derived(`delete ${type}`)
</script>

<div class="fieldset border-red-800">
    <main>
        <div class="grid gap-2">
            <div class="text-2xl capitalize">{title}</div>
            <div>{warning}</div>
        </div>
    </main>
    <footer class="bg-red-800">
        <button class="btn w-auto bg-white text-dark" onclick={() => modalOpen = true}>
            Delete
        </button>
    </footer>
</div>

<Drawer 
    bind:open={modalOpen}
>
    <form 
        {action} 
        method="post" 
        class="max-w-2xl mx-auto"
        use:enhance={({ cancel }) => {
            if(inputId !== id.toString() || inputVerify !== verifyText) {
                cancel()
                toast.error("Invalid input")
            }
            return async ({ result }) => {
                if(result.type === 'failure') {
                    // @ts-ignore
                    toast.error(result.data?.message || 'Error occured')
                }
                if(result.type === 'error') {
                    // @ts-ignore
                    toast.error(result.data?.message || 'Error occured')
                }
                if(result.type === 'success') {
                    toast.success(`Successfully deleted #${id}`)
                }
                if(result.type === 'redirect') {
                    toast.success(`Successfully deleted #${id}`)
                    goto(result.location)
                }
            }
        }}
    >
        <input type="hidden" name="id" value="{id}" />

        <div class="fieldset">
            <main>
                <div class="grid gap-4">
                    <div class="text-2xl capitalize">{title}</div>
                    <div>{warning}</div>
                    <div>This action is not reversible. Please be certain.</div>
                </div>

                <div class="bg-gray-950 grid gap-5 -mx-4 -my-3 px-4 py-5 mt-5 border-t border-gray-900">
                    <div>
                        <div>Enter id <b>{id}</b> to continue:</div>
                        <Input 
                            bind:value={inputId} 
                            pattern={`\s*${id}\s*`} 
                            required 
                        />
                    </div>
        
                    <div>
                        <div>To verify, type <b>{verifyText}</b> below:</div>
                        <Input 
                            bind:value={inputVerify} 
                            pattern={`\s*${verifyText}\s*`} 
                            required 
                        />
                    </div>
                </div>
            </main>
            <footer class="justify-between">
                <button class="link w-auto" onclick={() => modalOpen = false}>
                    Cancel
                </button>

                <button class="btn w-auto bg-red-800" type="submit">
                    Continue
                </button>
            </footer>
        </div>
    </form>
</Drawer>
