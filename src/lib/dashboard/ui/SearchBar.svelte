<script lang="ts">
    import { Input, Select, add_query_args } from "$lib/dashboard"
    import { page } from "$app/state"
    import { goto } from "$app/navigation"
    import type { Snippet } from "svelte"

    type LabelValue = {label: string; value: string;}

    const processSearch = args => {
        goto( add_query_args(page.url.toString(), args))
    }

    let _search = $state('')

    let {
        search = $bindable(),
        order = $bindable(),
        hideSearch = false,
        orderItems,
        addNew,
        children,
    }: {
        search?: string,
        hideSearch?: boolean,
        order?: string,
        orderItems?: LabelValue[],
        addNew?: string,
        children?: Snippet,
    } = $props()

</script>

<div class="w-full overflow-x-auto scrollbar-hide">
    <div class="flex items-center gap-2 mb-6">
        {#if !hideSearch}
            <div class="grow min-w-56">
                <Input search 
                    bind:value={_search}  
                    placeholder={search || 'Search...'} 
                    onchange={e => {
                        // reset after clearing
                        if(e.target.value === '') {
                            processSearch({search: '', page: 1})
                        }
                    }}
                    onkeydown={e => {
                        if(e.key === 'Enter'){
                            processSearch({search: _search, page: 1})
                        }
                    }} 
                />
            </div>
        {/if}

        {@render children?.()}

        {#if orderItems}
            <div>
                <Select 
                    bind:value={order}
                    options={orderItems}
                    onchange={e => {
                        processSearch ({
                            // @ts-ignore
                            order: e.target?.value, 
                            page: 1
                        })
                    }}
                />
            </div>
        {/if}

        {#if addNew}
            <div>
                <a class="btn py-2 bg-white text-black" color="secondary" href={addNew}>
                    <span class="hidden md:block">Add New</span>
                    <span class="md:hidden">+</span>
                </a>
            </div>
        {/if}
    </div>
    
</div>
