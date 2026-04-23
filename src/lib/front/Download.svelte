<script lang="ts">
    import { Icon, Tooltip } from "$lib/app"
</script>

{#snippet Button({ link, name, icon })}
    <Tooltip content="Soon Q3/2026" position="top">
        <a
            href={link}
            rel="noopener noreferrer"
            class="bg-white text-dark px-4 py-1.5 rounded-lg flex gap-1.5 items-center justify-center self-center transition-all duration-300 hover:bg-white/90"
        >
            <Icon size={24} name={icon} />
    
            <div class="py-0.5 flex flex-col pr-1">
                <span class="text-xs sm:text-[8px] font-normal text-left">Download on</span>
                <span class="-mt-1 text-sm font-semibold">{name}</span>
            </div>
        </a>
    </Tooltip>
{/snippet}

<div class="py-10 px-3 overflow-x-auto scrollbar-hide">
    <div class="flex gap-4 justify-start md:justify-center">
        {@render Button({
            link: 'javascript:void(0)',
            name: 'App Store',
            icon: 'ri:apple-fill'
        })}
    
        {@render Button({
            link: 'javascript:void(0)',
            name: 'Google Play',
            icon: 'simple-icons:googleplay'
        })}
    </div>
</div>
