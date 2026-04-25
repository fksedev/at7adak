<script lang="ts">
    import { SearchBar, Template, __date_item, Paginate, Radio, Select, flag_emoji, Avatar, Dropdown, add_query_args, type Country, useTooltip, Icon, cn }  from "$lib/dashboard";
    import type { PageData } from "./$types"

    import { page } from "$app/state"
    import { goto } from "$app/navigation"

    let { data }: { data: PageData } = $props();

    let search = $derived(data.search)
    let order = $derived(data.order)
    let pagination = $derived(data.pagination)
    let items = $derived(data.items)
    let country = $derived(data.country || '')

    $effect(() => {
        search = data.search
        order = data.order
        pagination = data.pagination
        items = data.items
        country = data.country || ''
    })

    const process = args => {
        goto( add_query_args(page.url.toString(), args))
    }

</script>


<Template title="Users">
    <div class="container">
        <SearchBar 
            bind:search={search}
            bind:order={order}
            orderItems={[
                {label: 'Sort by Latest', value: 'latest'},
                {label: 'Sort by Oldest', value: 'oldest'},
                {label: 'Sort by Name', value: 'name'},
            ]}
        >
        </SearchBar>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each items as i, idx}
                <div class="card space-y-2">
                    <div class="flex gap-3">
                        <div>
                            <Avatar 
                                name={i.name} 
                                email={i.email} 
                                size={40}
                                rounded 
                            />
                        </div>
                        <div class="flex flex-1 flex-col">
                            <div class="flex-between">
                                <div class="text-lg font-bold flex items-center gap-2">
                                    {i.name}
                                </div>
                                <div class="text-3xl">
                                    {flag_emoji(i.country as Country)}
                                </div>
                            </div>

                            <div>{i.email}</div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-0">
                        <div class="flex items-end gap-1">
                            <span class="text-xs opacity-50">REG:</span> {@html __date_item(i.createdAt)}
                        </div>
                        <div class="flex items-end gap-1">
                            <span class="text-xs opacity-50">LOGIN:</span> {@html __date_item(i.loginAt)}
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <!-- <div>{i.referred || 0} referred</div> -->
                    </div>
                </div>
            {/each}
        </div>

        <div>
            {#key pagination.pagination}
                <Paginate 
                    current_page={pagination.pagination.currentPage}
                    per_page={pagination.pagination.perPage}
                    total={pagination.pagination.total}
                />  
            {/key}
        </div>
    </div>
    
</Template>
