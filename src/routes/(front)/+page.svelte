<script lang="ts">
    import { Icon } from "$lib/app"
    import { Download, Socials, Logo, SeoSite, BtnSkew, content } from "$lib/front";
</script>
<SeoSite />

<div class="relative">

    <div class="bg-[url('/assets/hero-bg.webp')] bg-no-repeat bg-cover bg-center min-h-170  absolute inset-x-0 top-10 z-0 opacity-60"></div>

    <div class=" absolute inset-x-0 top-10 h-40 bg-linear-to-b from-black to-transparent"></div>

    <div class="relative min-h-170">
        <div class="container py-4">
            <div class="flex-between">
                <Logo className="h-25" />
                <Socials />
            </div>
        </div>

        <div class="container space-y-10">
            <div class="md:max-w-150 mx-auto">
                <div class="flex-center flex-col md:flex-row gap-5">
                    <div class="space-y-5">
                        <div class="font-hero font-bold italic">
                            <h2 class="text-white text-5xl">The competition</h2>
                            <h2 class="text-green text-6xl">Starts Soon</h2>
                        </div>
        
                        <div class="leading-[1.2]">
                            Atadak is the ultimate competitive gaming app. Challenge real players, compete in matches, and win real money.
                        </div>

                        <div class="font-hero font-bold text-3xl italic">
                            NO LUCK. <span class="text-green">ONLY SKILL.</span>
                        </div>
        
                        <BtnSkew icon="bi:bell-fill">
                            Notify Me
                        </BtnSkew>

                        <div class="flex items-center gap-1 text-sm">
                            <div class="text-green">
                                <Icon name="mdi:chevron-double-right" />
                            </div>
                            Be the first to download when we launch
                        </div>
                    </div>
    
                    <div>
                        <img src="/assets/hero-iphone.png" alt="" class="-skew-x-6 w-[60vw] md:w-auto" />
                    </div>
                </div>
    
            </div>

            <div>
                <div class="font-hero font-bold italic text-green text-4xl text-center">
                    Available Soon
                </div>
                <Download className="py-3" />
            </div>
        </div>
    </div>
    
    <div class="container relative">
        <div class="grid md:grid-cols-4 py-10 gap-10 md:gap-0 md:divide-x divide-border/50">
            <div class="pe-10">
                <div class="font-hero font-bold italic text-4xl">
                    WHAT IS <span class="text-green">AT7ADAK?</span>
                </div>
                <div class="text-sm">{content.what.text}</div>
            </div>

            {#each content.what.items as item, index}
                <div class="flex-center flex-col gap-1 text-green px-8 text-center">
                    <div class="h-12 flex-center" class:text-red={index === 1}>
                        <Icon name={item.icon} size={48} />
                    </div>
                    <div class="font-hero font-bold italic text-2xl">{item.title}</div>
                    <div class="text-white text-sm">{item.desc}</div>
                </div>
            {/each}
        </div>
    </div>

    <div class="container relative py-10">
        <div class="font-hero font-bold italic text-4xl text-center mb-4">
            <span class="text-green">HOW IT</span> WORKS
        </div>

        <div class="grid md:grid-cols-3 gap-4 md:gap-10">
            
            {#each content.how as item, index}
                <div class="flex-center flex-col gap-1 text-green p-8 text-center border border-red/30 rounded-lg relative">
                    <div class="absolute top-3 left-3 font-hero font-bold italic text-green/20 text-6xl">{index+1}</div>
                    <div class="h-12 flex-center" class:text-red={index === 1}>
                        <Icon name={item.icon} size={48} />
                    </div>
                    <div class="font-hero font-bold italic text-2xl">{item.title}</div>
                    <div class="text-white text-sm">{item.desc}</div>
                </div>
            {/each}
        </div>
    </div>

    <div class="container relative py-10">
        <div class="font-hero font-bold italic text-4xl text-center mb-4">
            <span class="text-green">WHY</span> AT7ADAK?
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            
            {#each content.why as item, index}
                <div class="flex-center flex-col gap-1 text-green p-8 text-center border border-border rounded-lg relative">
                    <div class="h-12 flex-center" class:text-red={index === 1 || index === 3}>
                        <Icon name={item.icon} size={48} />
                    </div>
                    <div class="font-hero font-bold italic text-2xl">{item.title}</div>
                    <div class="text-white text-sm">{item.desc}</div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Banner -->

    <div class="container relative">
        <div class="border border-red/30 bg-red/10 rounded-lg p-4">
            <div class="flex-between flex-col md:flex-row gap-5">

                <div>
                    <div class="font-hero font-bold italic text-4xl leading-none">
                        THE COMPETITION STARTS <span class="text-green">SOON</span>
                    </div>
                    <div class="leading-none">
                        Be ready. The best players win.
                    </div>
                </div>

                <BtnSkew icon="bi:bell-fill">
                    Notify Me
                </BtnSkew>
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <div class="container relative py-10">
        <div class="grid md:grid-cols-3 gap-5 md:gap-0">
            <div class="flex-center gap-3">
                <Logo className="h-15" />
                <div>
                    {`Atladak is the ultimate\ncompetitive gaming app.`}
                </div>
            </div>

            <div class="md:flex-center">
                <Socials />
            </div>

            <div class="md:text-end">
                <div class="text-sm opacity-65">&copy; 2026 At7adak, all rights reserved</div>
                <div class="font-hero font-bold italic text-3xl">
                    PLAY. <span class="text-green">COMPETE</span>. <span class="text-red">WIN.</span>
                </div>
            </div>
        </div>
    </div>
</div>
