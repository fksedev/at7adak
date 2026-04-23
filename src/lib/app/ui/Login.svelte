<script lang="ts">
    import { decrypt, Loader, Icon, toast, cn } from "$lib/app"

    let {
        KEY = 'login_pass',
        title = '',
        password,
        className = '',
        logout = $bindable(),
        children = null
    } = $props()
    
    let auth = $state(false)
    let loading = $state(true)
    let value = $state('')

    const _logout = async () => {
        localStorage.removeItem(KEY)
        value = ''
        auth = false
    }

    const login = () => {
        let pass = decrypt(password)
        if(pass === value){
            localStorage.setItem(KEY, password)
            auth = true
            value = ''
        } else {
            toast.error('Invalid password!')
        }
    }

    $effect(() => {
        const pass = localStorage.getItem(KEY)
        if(pass === password) auth = true
        loading = false

        logout = _logout
    })

</script>

{#if loading}
    <div 
        class={cn(
            "fixed inset-0 flex items-center justify-center z-1001 bg-black text-purple-100", 
            className
        )}
    >
        <Loader size={48} />
    </div>
{:else}
    {#if !auth}
        <div 
            class={cn("fixed inset-0 flex items-center justify-center z-1001 bg-black text-purple-100", className)}
        >
            <div class="w-96 max-w-[90%] bg-white text-dark rounded-xl p-6">
                
                <div class="leading-none px-5">
                    <div>{@html title}</div>
                    <!-- <div class="text-base uppercase font-medium mb-1">Enter Password:</div> -->
                </div>

                <form 
                    class="flex items-center justify-center bg-[#eee] w-full rounded-full" 
                    onsubmit={login}
                >
                    <div class="flex-1">
                        <!-- svelte-ignore a11y_autofocus -->
                        <input class="bg-transparent w-full focus:outline-none h-12 px-4" bind:value autofocus type="password" placeholder="Password" />
                    </div>

                    <button class="h-12 px-3 rounded" type="submit">
                        <Icon name="ph:arrow-right-thin" />
                    </button>
                </form>
            </div>
        </div>
    {:else}
        {@render children?.()}
    {/if}
{/if}
