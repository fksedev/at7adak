<script lang="ts">
    import { Icon, Tooltip, cn } from "$lib/app"
    let { dark = true, className = '' } = $props()
</script>

{#snippet Button({ link, name, icon })}
    <Tooltip 
        content="Soon Q3/2026" 
        position="top"
        className="bg-green text-black font-bold"
        arrowColor="#c6df28"
    >
        <a
            href={link}
            rel="noopener noreferrer"
            class={cn(
                "bg-white text-dark px-4 py-1.5 rounded-lg flex gap-1.5 items-center justify-center self-center transition-all duration-300 hover:bg-white/90 trans",
                dark && "bg-black hover:bg-white/10 text-white border border-border fill-white"
            )}
        >
            <Icon size={20} name={icon} />
    
            <div class="py-0.5 flex flex-col pr-1">
                <span class="text-xs sm:text-[8px] font-normal text-left">Download on</span>
                <span class="-mt-1 text-sm font-semibold">{name}</span>
            </div>
        </a>
    </Tooltip>
{/snippet}

<div class={cn("py-10 px-3 overflow-x-auto scrollbar-hide", className)}>
    <div class="flex gap-4 justify-start md:justify-center">
        {@render Button({
            link: 'javascript:void(0)',
            name: 'App Store',
            icon: 'logos:apple'
        })}
    
        {@render Button({
            link: 'javascript:void(0)',
            name: 'Google Play',
            icon: 'logos:google-play-icon'
        })}
    </div>
</div>
