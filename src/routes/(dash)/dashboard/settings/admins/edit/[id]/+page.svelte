<script lang="ts">
    import type { PageData } from "./$types"
    import { Input, Header, DeletePanel, toast }  from "$lib/dashboard";
    import { enhance } from "$app/forms"
    import { goto } from "$app/navigation"

    let { data }: { data: PageData } = $props();
    let item = $derived(data.item)


    let loading = $state(false)
    let loadingPass = $state(false)

</script>

<Header title="Edit Admin #{item.id}" back="/dashboard/settings/admins" />

<form method="post" action="?/edit" use:enhance={() => {
    loading = true
    return async ({result, update}) => {
        loading = false
        if(result.type === 'redirect'){
            toast.success('Admin Added')
            goto(result.location)
        }
        if(result.type === 'success'){
            toast.success('Saved')
            await update({ reset: false })
        }
        if(result.type === 'failure'){
            // @ts-ignore
            toast.error((result.data.msg).toString())
        }
    }
}}>
    <div class="fieldset">
        <main>
            <Input placeholder="Name" name="name" value={item.name} required />
            <Input type="email" placeholder="Email" name="email" value={item.email} help="" />
        </main>

        <footer class="flex justify-end">
            <button type="submit" class="btn w-auto" class:loading>Save</button>
        </footer>
    </div>
</form>

<div class="h-10"></div>

<form method="post" action="?/changepwd" use:enhance={({ formElement }) => {
    loadingPass = true
    return ({result}) => {
        loadingPass = false
        if(result.type === 'success'){
            toast.success('Saved')
            formElement.reset()
        }
        if(result.type === 'failure'){
            // @ts-ignore
            toast.error((result.data.msg).toString())
        }
    }
}}>
    <div class="fieldset">
        <main>
            <Input type="password" placeholder="Password" name="password" required  minlength={8} maxlength={20} />
            <Input type="password" placeholder="Repeat Password" name="password_verify" required minlength={8} maxlength={20} />
        </main>
        
        <footer class="flex justify-end">
            <button type="submit" class="btn w-auto" class:loading={loadingPass}>Change Password</button>
        </footer>
    </div>
</form>


<div class="my-20">
    <DeletePanel id={item.id} type="admin" />
</div>
