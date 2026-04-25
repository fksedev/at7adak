<script lang="ts">
    import { page, navigating } from '$app/state';
    import { getAvatar, Dropdown, LoadingDots, Seo } from '$lib/dashboard'
    import { onMount } from 'svelte'
    import links from '../_menu'

    let { title = '', children } = $props()

    let user = $state(page.data.ADMIN)
    let mounted = $state(false)
    onMount(() => { mounted = true })
</script>

<Seo {title} siteTitle={'Dashboard'} />

{#if user}
    <main class="bg-gray-999 min-h-svh w-screen">

    <div class="bg-gray-999 border-b border-gray-900 px-3 md:px-6 h-11.25 fixed top-0 inset-x-0 z-10 flex-center">
        <div class="flex-between w-full gap-3">
            <div class="flex flex-1 items-center gap-5 w-[80vw] md:w-auto overflow-x-scroll scrollbar-hide">
                <a href="/dashboard" aria-label="main" class="size-8 hidden md:flex-center text-gray-600 dark:text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        class="-rotate-12"
                    >
                        <line x1="22" x2="2" y1="6" y2="6" />
                        <line x1="22" x2="2" y1="18" y2="18" />
                        <line x1="6" x2="6" y1="2" y2="22" />
                        <line x1="18" x2="18" y1="2" y2="22" />
                    </svg>
                </a>

                <div class="flex items-center">
                    <a href="/dashboard/home" class="link md:hidden">Home</a>
                    {#each links as link}
                        <a href={link.href} class="link whitespace-nowrap">{link.label}</a>
                    {/each}
                </div>
            </div>
            <div class="flex-center gap-5">
                {#if navigating?.to}
                    <div class="text-gray-0">
                        <LoadingDots />
                    </div>
                {/if}

                <Dropdown className={'grid gap-2'}>
                    {#snippet trigger()}
                        <img src={getAvatar(user.email)} alt="user avatar" class="w-8 h-8 object-cover rounded-full">
                    {/snippet}
                    <a class="link whitespace-nowrap" href="/dashboard/settings/account">Account Settings</a>
                    <a class="link" href="/dashboard/auth/logout">Logout</a>
                </Dropdown>
            </div>
        </div>
    </div>

    <div class="h-11.25"></div>
    
    <div class="py-5 min-h-[calc(100vh-45px)] transition"
        class:opacity-0={!mounted}
        class:opacity-100={mounted}
    >
        {@render children?.()}
    </div>

</main>
{/if}
