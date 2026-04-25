<script lang="ts">
    import { Icon, useTooltip } from "$lib/dashboard"
    let {title, back = '', children = null} = $props()
</script>

<div class="py-5 md:py-10 px-3 -mt-3 md:-mt-6 -mx-3 md:px-6 md:-mx-6 bg-gray-990 border-b border-gray-900 mb-6 text-gray-0">
    <div class="container flex flex-col md:flex-row md:justify-between md:items-center gap-3">

        <div class="flex-center gap-3">
            {#if back}
                <a href={back} use:useTooltip={{content: 'Go Back'}}>
                    <div class="size-8 rounded-full border border-gray-900 flex-center">
                        <Icon name={'lucide:chevron-left'} size={24} />
                    </div>
                </a>
            {/if}
            
            <h2 class="font-light text-xl md:text-3xl">
                {@html title}
            </h2>
        </div>

        <div class="flex flex-wrap items-center justify-center md:justify-end gap-3">
            {@render children?.()}
        </div>
    </div>
</div>
