<script lang="ts">
    import { fetcher, Icon, validEmail } from "$lib/front"
    import { Download, FrontHeader, FrontFooter, SeoSite, BtnSkew, content, Modal, Input } from "$lib/front";
    import type { PageData } from './$types'

    let { data }: { data: PageData } = $props()

    let modalOpen = $state(false)
    let name = $state('')
    let email = $state('')
    let loading = $state(false)
    const baseErrors = { name: '', email: ''}
    let errors = $state(baseErrors)

    const notify = async () => {
        errors = baseErrors
        if(name.length < 3) {
            errors.name = 'Invalid name'
            return
        }
        if(!validEmail(email)) {
            errors.email = 'Invalid Email'
            return
        }

        loading = true

        const res = await fetcher.post('/api/newsletter', {
            name,
            email
        })

        if (res.data.ok) {
            alert(`Welcome ${name} to At7adak, we'll notify you once the app is ready`)
        } else {
            alert(res.data?.error || 'Error Occured')
        }

        loading = false 
        modalOpen = false

    }

    const showModal = () => {
        name = ''
        email = ''
        errors = baseErrors
        loading = false
        modalOpen = true
    }
</script>
<SeoSite />

<div class="relative overflow-x-hidden">

    <div class="bg-[url('/assets/hero-bg.webp')] bg-no-repeat bg-cover bg-center min-h-[70vh] md:min-h-170 absolute inset-x-0 top-10 z-0 opacity-60"></div>

    <div class="absolute inset-x-0 top-10 h-40 bg-linear-to-b from-black to-transparent"></div>

    <div class="relative min-h-[70vh] md:min-h-170">
        <FrontHeader active="home" />

        <div class="container space-y-8 md:space-y-10 pb-8">
            <div class="md:max-w-150 mx-auto">
                <div class="flex-center flex-col md:flex-row gap-6 md:gap-5">
                    <div class="space-y-4 md:space-y-5 w-full text-center md:text-left">
                        <div class="font-hero font-bold italic">
                            <h2 class="text-white text-4xl sm:text-5xl">The competition</h2>
                            <h2 class="text-green text-5xl sm:text-6xl">Starts Now</h2>
                        </div>
        
                        <div class="leading-[1.35] text-sm sm:text-base text-white/90 max-w-md mx-auto md:mx-0">
                            At7adak is the ultimate competitive gaming app. Challenge real players, compete in matches, and win real money.
                        </div>

                        <div class="font-hero font-bold text-2xl sm:text-3xl italic">
                            NO LUCK. <span class="text-green">ONLY SKILL.</span>
                        </div>
        
                        <div class="flex flex-col xs:flex-row flex-wrap gap-3 items-stretch sm:items-center justify-center md:justify-start">
                            <BtnSkew icon="mdi:download" href="/download" className="justify-center w-full sm:w-auto">
                                Download App
                            </BtnSkew>
                            <BtnSkew icon="bi:bell-fill" onclick={showModal} className="bg-transparent border border-green text-green hover:bg-green/10 justify-center w-full sm:w-auto">
                                Notify Me
                            </BtnSkew>
                        </div>

                        <div class="flex items-center justify-center md:justify-start gap-1 text-sm text-white/70">
                            <div class="text-green">
                                <Icon name="mdi:chevron-double-right" />
                            </div>
                            Available on the App Store and as Android APK
                        </div>
                    </div>
    
                    <div class="flex-center w-full md:w-auto">
                        <img src="/assets/hero-iphone.png" alt="AT7ADAK app" class="-skew-x-6 w-[42vw] max-w-48 sm:max-w-56 md:w-auto md:max-w-none" />
                    </div>
                </div>
    
            </div>

            <div>
                <div class="font-hero font-bold italic text-green text-3xl sm:text-4xl text-center">
                    Download AT7ADAK
                </div>
                <Download className="py-3 px-0" apk={data.apk} />
                <div class="text-center text-sm text-white/50">
                    <a href="/download" class="hover:text-green trans underline underline-offset-4">
                        Installation guide & FAQ
                    </a>
                </div>
            </div>
        </div>
    </div>
    
    <div class="container relative">
        <div class="grid md:grid-cols-4 py-8 md:py-10 gap-8 md:gap-0 md:divide-x divide-border/50">
            <div class="md:pe-10 text-center md:text-left">
                <div class="font-hero font-bold italic text-3xl sm:text-4xl">
                    WHAT IS <span class="text-green">AT7ADAK?</span>
                </div>
                <div class="text-sm mt-2 text-white/80 whitespace-pre-line">{content.what.text}</div>
            </div>

            {#each content.what.items as item, index}
                <div class="flex-center flex-col gap-1 text-green px-4 md:px-8 text-center">
                    <div class="h-12 flex-center" class:text-red={index === 1}>
                        <Icon name={item.icon} size={48} />
                    </div>
                    <div class="font-hero font-bold italic text-xl sm:text-2xl">{item.title}</div>
                    <div class="text-white text-sm">{item.desc}</div>
                </div>
            {/each}
        </div>
    </div>

    <div class="container relative py-8 md:py-10" id="how">
        <div class="font-hero font-bold italic text-3xl sm:text-4xl text-center mb-4">
            <span class="text-green">HOW IT</span> WORKS
        </div>
        <p class="text-center text-sm text-white/50 mb-6">
            <a href="/how-it-works" class="hover:text-green trans underline underline-offset-4">
                See the full 7-step guide →
            </a>
        </p>

        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
            
            {#each content.how as item, index}
                <div class="flex-center flex-col gap-1 text-green p-6 sm:p-8 text-center border border-red/30 rounded-lg relative">
                    <div class="absolute top-3 left-3 font-hero font-bold italic text-green/20 text-5xl sm:text-6xl">{index+1}</div>
                    <div class="h-12 flex-center" class:text-red={index === 1}>
                        <Icon name={item.icon} size={48} />
                    </div>
                    <div class="font-hero font-bold italic text-xl sm:text-2xl">{item.title}</div>
                    <div class="text-white text-sm">{item.desc}</div>
                </div>
            {/each}
        </div>
    </div>

    <div class="container relative py-8 md:py-10">
        <div class="font-hero font-bold italic text-3xl sm:text-4xl text-center mb-4">
            <span class="text-green">WHY</span> AT7ADAK?
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            
            {#each content.why as item, index}
                <div class="flex-center flex-col gap-1 text-green p-4 sm:p-8 text-center border border-border rounded-lg relative">
                    <div class="h-10 sm:h-12 flex-center" class:text-red={index === 1 || index === 3}>
                        <Icon name={item.icon} size={40} />
                    </div>
                    <div class="font-hero font-bold italic text-lg sm:text-2xl leading-tight">{item.title}</div>
                    <div class="text-white text-xs sm:text-sm">{item.desc}</div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Banner -->

    <div class="container relative pb-2">
        <div class="border border-red/30 bg-red/10 rounded-lg p-4 sm:p-5">
            <div class="flex-between flex-col md:flex-row gap-5 text-center md:text-left">

                <div>
                    <div class="font-hero font-bold italic text-2xl sm:text-4xl leading-none">
                        THE COMPETITION STARTS <span class="text-green">NOW</span>
                    </div>
                    <div class="leading-none mt-2 text-sm sm:text-base lg:tracking-[0.18em]">
                        PLAY. COMPETE. WIN REWARDS.
                    </div>
                </div>

                <BtnSkew icon="mdi:download" href="/download" className="justify-center w-full sm:w-auto">
                    Download App
                </BtnSkew>
            </div>
        </div>
    </div>

    <FrontFooter />
</div>


<Modal bind:open={modalOpen}>
    <div class="space-y-4 w-full max-w-md md:min-w-xl">
        <div class="font-hero font-bold italic text-2xl sm:text-3xl text-green">
            Notify Me
        </div>

        <Input 
            placeholder="Your Name"
            label="Name"
            bind:value={name}
            error={errors.name}
        />

        <Input 
            placeholder="Your Email"
            label="Email"
            bind:value={email}
            error={errors.email}
        />

        <button 
            class="font-hero font-bold italic text-2xl sm:text-3xl bg-green py-2 rounded-lg text-black w-full flex-center"
            disabled={loading}
            class:loading
            onclick={notify}
        >
            Notify Me
        </button>
    </div>
</Modal>
