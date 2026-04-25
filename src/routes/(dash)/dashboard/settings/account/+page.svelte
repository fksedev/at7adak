<script lang="ts">
    import { Input, toast } from "$lib/dashboard"
    import { page } from "$app/state"
    import { enhance } from "$app/forms"

    let user = $derived(page.data.ADMIN)
    let email = $derived(user?.email)
    let loading = $state(false)

</script>

<form action="?/process" method="post"
    use:enhance={({ formElement }) => {
        loading = true
        return async ({ result, update }) => {
            loading = false
            if(result.type === 'failure') {
                // @ts-ignore
                toast.error(result.data.message)
            }

            if(result.type === 'success') {
                toast.success('Password changed')
                formElement.reset()
            }
        }

    }}
>
    <div class="fieldset">
        <main>
            <div class="py-2 flex flex-col gap-6">
                <div class="text-2xl">Account Information</div>

                <Input 
                    placeholder="Email" 
                    name="email" 
                    type="email" 
                    disabled 
                    bind:value={email} 
                    help={'To change your login email, you need to consult with management'}
                />

                <Input 
                    placeholder="Old Password" 
                    type="password" 
                    name="oldpassword" 
                />

                <Input 
                    placeholder="New Password" 
                    type="password" 
                    name="password" 
                    help="New password must be at least 8 characters long"
                />

            </div>
        </main>
        <footer class="flex justify-end place-items-center">
            <button type="submit" class="btn w-auto" class:loading>Save</button>
        </footer>
    </div>

    
</form>
