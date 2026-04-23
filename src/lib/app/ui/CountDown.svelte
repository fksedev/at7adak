<!-- @wc-ignore-file -->
<script lang="ts">
    // @wc-ignore-file
    import { onMount } from "svelte"
    import { cn, NumberFlow } from "$lib/app"

    interface Delta {
        total: number
        days: number
        hours: number
        minutes: number
        seconds: number
        milliseconds: number
        completed: boolean
    }

    let {
        to,
        lang = 'en',
        className = '',
        numberClass = '',
        labelClass = '',
        gap = 12,
        ontick,
        oncompleted,
    }: {
        to: string | number | Date,
        lang?: 'en' | 'ar',
        className?: string,
        numberClass?: string,
        labelClass?: string,
        gap?: number,
        ontick?: (remaining: Delta) => void
        oncompleted?: () => void,
    } = $props()

    const langs = {
        days: {
            plural: {
                en: 'days',
                ar: 'أيام',
            },
            single: {
                en: 'day',
                ar: 'يوم',
            }
        },
        hours: {
            plural: {
                en: 'hours',
                ar: 'ساعات',
            },
            single: {
                en: 'hour',
                ar: 'ساعة',
            },
        },
        min: {
            plural: {
                en: 'minutes',
                ar: 'دقائق',
            },
            single: {
                en: 'minute',
                ar: 'دقيقة',
            },
        },
        sec: {
            plural: {
                en: 'seconds',
                ar: 'ثواني',
            },
            single: {
                en: 'second',
                ar: 'ثانية',
            },
        },
    }

    type Langs = keyof typeof langs

    const __ = (input: Langs, lang: 'en' | 'ar', num: number) => {
        if (!input) return ''
        let str = input.trim()

        if(lang === 'ar') {
            if(num > 10) {
                return langs[str].single.ar
            } else {
                return langs[str].plural.ar
            }
        } else {
            if(num === 1) {
                return langs[str].single.en
            } else {
                return langs[str].plural.en
            }
        }
    }

    let result = $state<Delta>({
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        completed: false
    })

    function calcTimeDelta(date: Date | string | number): Delta {
        let startTimestamp: number

        if (typeof date === "string") {
            startTimestamp = new Date(date).getTime()
        } else if (date instanceof Date) {
            startTimestamp = date.getTime()
        } else {
            startTimestamp = date
        }

        const timeLeft = startTimestamp - Date.now()
        const total = Math.round( (Math.max(0, timeLeft) / 1000) * 1000 )

        const seconds = Math.abs(total) / 1000

        return {
            total,
            days: Math.floor(seconds / (3600 * 24)),
            hours: Math.floor((seconds / 3600) % 24),
            minutes: Math.floor((seconds / 60) % 60),
            seconds: Math.floor(seconds % 60),
            milliseconds: Number(((seconds % 1) * 1000).toFixed()),
            completed: total <= 0,
        }
    }

    let timer

    const process = () => {
        result = calcTimeDelta(to)
        if (result.completed) {
            oncompleted?.()
            clearInterval(timer)
        }
        ontick?.(result)
    }

    const load = () => {
        process()
        timer = setInterval(() => {
            process()
        }, 1000)
    }

    onMount(() => {
        load()
        return () => {
            clearInterval(timer)
        }
    })
</script>

{#snippet Block(type, value)}
    <div class={cn("flex flex-col p-2 bg-black rounded-box text-white rounded-lg select-none text-5xl", className)}>
        <NumberFlow 
            class={cn("font-mono font-bold", numberClass)}
            {value} 
            format={{minimumIntegerDigits: 2}}
            willChange
        />
        <div class={cn("text-sm opacity-65", labelClass)}>{type}</div>
    </div>
{/snippet}

{#if !result.completed}
    <div 
        class="grid grid-flow-col text-center auto-cols-max" 
        style:gap={`${gap}px`} 
        style:direction={lang === 'ar' ? 'rtl': 'ltr'}
    >
        {#if result.days}
            {@render Block(__('days', lang, result.days), result.days)}
        {/if}
        {@render Block(__('hours', lang, result.hours), result.hours)}
        {@render Block(__('min', lang, result.minutes), result.minutes)}
        {@render Block(__('sec', lang, result.seconds), result.seconds)}
    </div>
{/if}
