<script lang="ts">
    import { page } from "$app/state"
    import { Icon } from "$lib/dashboard"
    let {
        current_page = 1,
        total = 120,
        per_page = 5,
    } = $props()

    let num_pages = $derived(Math.ceil(total / per_page))

    function buildArr(c, n) {
        if (n <= 7) {
            return [...Array(n)].map((_, i) => i + 1)
        } else {
            if (c < 3 || c > n - 2) {
                return [1, 2, 3, "...", n - 2, n - 1, n]
            } else {
                return [1, "...", c - 1, c, c + 1, "...", n]
            }
        }
    }

    let arr_pages = $derived.by(() => buildArr(current_page, num_pages))

	const plurify = (singular, num) => {
		num = parseInt(num.toString())
		if(num === 1) return singular
		return `${singular}s`
	}

    const _url = (_page) => {
        let query = new URLSearchParams(page.url.search.toString());
        query.set('page', _page);
        return `${page.url.origin}${page.url.pathname}?${query.toString()}`;
    }
</script>

<div class="py-10 dark:text-gray-500">
    {#if arr_pages.length > 1}
        <div class="flex-center">

            <a href={_url(current_page - 1)}
                class="mr-1 size-8 flex-center rounded-full"
                class:cursor-pointer={current_page > 1}
                class:opacity-20={current_page <= 1}
            >
                <Icon name="chevron-left" size={16} />
            </a>

            <div
                class="flex h-8 font-medium"
            >
                {#each arr_pages as i}
                    <a href={_url(i)} data-sveltekit-replacestate
                        class="w-8 rounded-full flex-center select-none cursor-pointer leading-5 transition-all"
                        class:dark:bg-gray-0={i == current_page}
                        class:dark:text-gray-999={i == current_page}
                        class:bg-gray-999={i == current_page}
                        class:text-gray-0={i == current_page}
                    >
                        {i}
                    </a>
                {/each}
            </div>

            {#if current_page < num_pages}
                <a 
                    href={_url(current_page + 1)}
                    class="size-8 ml-1 flex-center rounded-full"
                >
                    <Icon name="chevron-right" size={16} />
                </a>
            {/if}

        </div>
    {/if}

    <div class="text-sm text-center my-2 px-5 py-1">
        {total} {plurify('record', total)} / {num_pages} {plurify('page', num_pages)}
    </div>

    
</div>
