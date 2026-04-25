<script lang="ts">
    import { Template, LoadingDots, fetcher, Icon } from "$lib/dashboard"

    let loading = $state(false)
    let totalUsers = $state(0)
    let totalNewsletter = $state(0)

    const load = async() => {
        loading = true
        const {data, ok } = await fetcher.post('/dashboard/home')
        if(ok) {
            totalUsers = data.totalUsers
            totalNewsletter = data.totalNewsletter
        }
        loading = false
    }
    
    $effect.pre(() => {
        load()
    })

</script>

{#snippet Card({ title, value, href, subtitle = '', icon = '' })}
    <div class="card">
        <a href={href} class="flex items-center gap-3">
            <div class="text-3xl lg:text-5xl font-black leading-none">{value}</div>

            <div class="flex-1">
                <div class="text-base font-medium opacity-65">
                    <div>{title}</div>
                </div>
                {#if subtitle}
                    <div>
                        {@html subtitle}
                    </div>
                {/if}
            </div>

            {#if icon}
            <div class="text-gray-800">
                    <Icon name={icon} size={48} />
                </div>
            {/if}
        </a>
    </div>
{/snippet}

<Template title="Dashboard">
    <div class="container">
        {#if loading}
            <div class="py-10 flex-center">
                <LoadingDots />
            </div>
        {:else}
            <div class="grid lg:grid-cols-2 gap-3">

                {@render Card({
                    href: '/dashboard/users',
                    title: 'All Users',
                    value: totalUsers,
                    icon: 'fluent-mdl2:temporary-user'
                })}

                {@render Card({
                    href: '/dashboard/newsletter',
                    title: 'Newsletter Users',
                    value: totalNewsletter,
                    icon: 'fluent-mdl2:temporary-user'
                })}
            </div>

        {/if}
    </div>

</Template>
