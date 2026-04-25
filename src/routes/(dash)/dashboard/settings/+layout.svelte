<script lang="ts">
    import { page } from "$app/state"
    import {Template, Header, cn} from "$lib/dashboard"

    let { children } = $props();

    const links = [
        {label: 'Settings', href: '/dashboard/settings'},
        {label: 'Admins', href: '/dashboard/settings/admins'},
        {label: 'SMTP', href: '/dashboard/settings/smtp'},
        {label: 'Account Settings', href: '/dashboard/settings/account'},
    ]
</script>

<Template title="Settings">
    <Header title="Settings" />
    <div class="container">
    <div class="md:grid md:grid-cols-4 gap-10">
        <div class="hidden md:block space-y-4">
            {#each links as link}
                {@const active = page.url.pathname === link.href}
                <a href={link.href} 
                    class={cn(
                        "btn bg-transparent border",
                        active ? "bg-white text-black" : "hover:bg-gray-900"
                    )}
                >
                    {link.label}
                </a>
            {/each}
        </div>

        <div class="md:hidden mb-3">
            <div class="flex items-center overflow-x-auto scrollbar-hide">
                {#each links as link}
                    {@const active = page.url.pathname === link.href}
                    <a 
                        href={link.href}
                        class="link whitespace-nowrap" 
                        class:bg-white={active}
                        class:text-black={active}
                    >
                        {link.label}
                    </a>
                {/each}
            </div>
        </div>

        <div class="md:col-span-3">
            {@render children?.()}
        </div>
    </div>
    </div>
</Template>
