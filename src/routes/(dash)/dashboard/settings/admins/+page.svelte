<script lang="ts">
    import { __date_item, gravatar, SearchBar, Paginate, Dropdown, Icon }  from "$lib/dashboard";
    import QrImage from "./QrImage.svelte";
    import type { PageData } from "./$types"

    let { data }: { data: PageData } = $props();

    let search = $derived(data.search)
    let order = $derived(data.order)
    let pagination = $derived(data.pagination)
    let items = $derived(data.items)

    $effect(() => {
        search = data.search
        order = data.order
        pagination = data.pagination
        items = data.items
    })
    
</script>

<SearchBar 
    bind:search={search}
    bind:order={order}
    orderItems={[
        {label: 'Sort by Latest', value: 'latest'},
        {label: 'Sort by Oldest', value: 'oldest'},
        {label: 'Sort by Name', value: 'name'},
    ]}
    addNew="/dashboard/settings/admins/new"
/>

<div class="grid grid-cols-1 gap-6">
    {#each items as i, idx}
        <div class="card">
            <div class="flex justify-between items-start gap-3 md:gap-6">
                <div class="md:flex-between w-full">
                    <div class="flex flex-col gap-3">
                        <div class="flex gap-3 mb-2">
                            <div>
                                <img src={gravatar(i.email)} alt="avatar" class="size-10 rounded-full">
                            </div>
                            <div class="flex flex-col">
                                <div class="text-2xl">{i.name}</div>
                                <div class="text-sm">{i.email}</div>
                            </div>
                        </div>
                        
                        <div>---</div>
                        <div class="text-sm">Last login at: {@html __date_item(i.loginAt)}</div>
                    </div>
                    
                    <div class="mt-3 md:mt-0">
                        <QrImage item={i} />
                    </div>
                </div>

                <Dropdown>
                    <div class="space-y-2 divide-white/20 divide-y">
                        <a class="p-2 hover:bg-gray-900 block" href={`/dashboard/settings/admins/edit/${i.id}`}>Edit</a>
                        <div class="text-sm whitespace-nowrap py-2">Created at: {@html __date_item(i.createdAt)}</div>
                        <div class="text-sm">IP: {i.loginIp}</div>
                    </div>
                </Dropdown>
            </div>
        </div>
    {/each}
</div>

<div>
    <Paginate 
        current_page={pagination.pagination.currentPage}
        per_page={pagination.pagination.perPage}
        total={pagination.pagination.total}
    />
</div>
    
