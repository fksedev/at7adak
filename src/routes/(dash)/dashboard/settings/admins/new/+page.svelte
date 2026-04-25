<script lang="ts">
    import { toast, Input, Header }  from "$lib/dashboard";
    import { enhance } from "$app/forms"
    import { goto } from "$app/navigation"
    let loading = $state(false)

</script>

<Header title="Add Admin" back="/dashboard/settings/admins" />

<form method="post" action="?/add" use:enhance={() => {
    loading = true
    return ({result}) => {
        loading = false
        if(result.type === 'redirect'){
            toast.success('Admin Added')
            goto(result.location)
        }
        if(result.type === 'success'){
            toast.success('Saved')
        }
        if(result.type === 'failure'){
            // @ts-ignore
            toast.error((result.data.msg).toString())
        }
    }
}}>
    <div class="fieldset">
        <main>
            <Input placeholder="Name" name="name" required />
            <Input type="email" placeholder="Email" name="email" required />
            <Input type="password" placeholder="Password" name="password" required  minlength={8} maxlength={20} />
            <Input type="password" placeholder="Repeat Password" name="password_verify" required minlength={8} maxlength={20} />
        </main>

        <footer class="flex justify-end">
            <button type="submit" class="btn w-auto" class:loading>Save</button>
        </footer>
    </div>
</form>
