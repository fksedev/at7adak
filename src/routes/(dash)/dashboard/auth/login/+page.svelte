<script lang="ts">
    import { applyAction, enhance } from "$app/forms"
    import { toast, Icon, Drawer, BgPattern } from "$lib/dashboard"

    let loading = $state(false)
    let showForgot = $state(false)

    const googleAuthIcons = [
        {
            icon: 'ic:sharp-apple',
            url: 'https://apps.apple.com/us/app/google-authenticator/id388497605',
            size: 30
        },
        {
            icon: 'devicon:android',
            url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US',
            size: 24
        },
        {
            icon: 'devicon:chrome',
            url: 'https://chrome.google.com/webstore/detail/authenticator/bhghoamapcdpbohphigoooaddinpkbai',
            size: 24
        },
    ]
</script>

<svelte:head>
    <title>Login | Dashboard</title>
</svelte:head>

<div class="size-screen relative flex-center bg-gray-990">
    <BgPattern type="dot" color={'rgb(255 255 255 / 0.15)'} />

    <div class="relative w-full flex justify-between p-8 border rounded-lg max-w-87.5 md:max-w-150 bg-gray-999">

        <form
            method="post"
            action="?/login"
            class="grow w-full flex flex-col gap-4 place-items-start justify-center"
            use:enhance={({ formElement }) => {
                loading = true

                return async ({ result, update }) => {
                    loading = false
                    if (result.type === "success") {
                        formElement.reset()
                        window.location.href = "/dashboard"
                    }
                    if (result.type === "failure") {
                        toast.error(result.data!.message as string)
                    }
                    await applyAction(result)
                    update()
                }
            }}
        >
            <input type="email" name="email" class="input" placeholder="Email" />
            <input type="password" name="password" class="input" placeholder="Password" />
            <input name="token" class="input" placeholder="Google Authenticator Token" />

            <div class="flex-between w-full">
                <div class="text-sm text-gray-600">Download GA:</div>
                <div class="flex items-center gap-5">
                    {#each googleAuthIcons as icon}
                        <a
                            href={icon.url}
                            target="_blank"
                            class="hover:opacity-60 transition dark:text-white"
                        >
                            <Icon icon={icon.icon} size={icon.size} />
                        </a>
                    {/each}
                </div>
            </div>

            <div class="flex w-full justify-end">
                <button
                    type="button"
                    class="text-blue-600 hover:text-blue-500 text-xs italic"
                    onclick={() => (showForgot = true)}
                >
                    Forgot password?
                </button>
            </div>

            <button type="submit" class="btn" class:loading>
                Continue
            </button>
        </form>
    </div>
</div>

<Drawer 
    bind:open={showForgot}
    className={'bg-gray-999'} 
    bgClass={'bg-gray-900/30'}   
    handleClass={'bg-gray-900'}
>
    <div class="flex flex-col gap-5 p-10 text-gray-100 max-w-2xl mx-auto">
        <h2 class="text-2xl">Forgot Password?</h2>

        <form
            method="post"
            action="?/reset"
            class="grow w-full flex flex-col gap-5 place-items-start justify-center"
            use:enhance={({ formElement }) => {
                loading = true

                return async ({ result, update }) => {
                    loading = false
                    if (result.type === "success") {
                        formElement.reset()
                        toast.success('We reset your password and sent to the email supplied!')
                        showForgot = false
                    }
                    if (result.type === "failure") {
                        // @ts-ignore
                        toast.error(result.data.message)
                    }
                    await applyAction(result)
                    update()
                }
            }}
        >
            <input type="email" name="email" class="input" placeholder="Email" />

            <button type="submit" class="btn" class:loading>
                Continue
            </button>

            <div class="text-sm">
                We will reset your password and email it!
            </div>
        </form>
    </div>
</Drawer>
