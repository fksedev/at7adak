<script lang="ts" module>
	import NumberFlowLite, { define, type Data } from './lib/lite'
	// Svelte only supports setters, but Svelte 4 didn't pick up inherited ones:
	export class NumberFlowElement extends NumberFlowLite {
		set __svelte_batched(batched: boolean) {
			this.batched = batched
		}
		override set data(data: Data | undefined) {
			super.data = data
		}
	}
	Object.keys(NumberFlowElement.defaultProps).forEach((key) => {
		// Use lowerCase for Svelte 5 for some reason:
		Object.defineProperty(NumberFlowElement.prototype, `__svelte_${key.toLowerCase()}`, {
			set(value) {
				this[key] = value
			},
			enumerable: true,
			configurable: true
		})
	})

	define('number-flow-svelte', NumberFlowElement)
</script>

<script lang="ts">
	import {
		type Value,
		type Format,
		renderInnerHTML,
		formatToData,
		type Props as NumberFlowProps
	} from './lib/lite'
	import type { HTMLAttributes } from 'svelte/elements'
	import { writable } from 'svelte/store'
	import { getGroupContext } from './group'
	import { BROWSER } from 'esm-env'

	let {
		el = undefined,
		locales = undefined,
		format = undefined,
		value,
		prefix = undefined,
		suffix = undefined,
		willChange = false,
		onanimationsstart,
		onanimationsfinish,

		transformTiming = NumberFlowElement.defaultProps.transformTiming,
		spinTiming = NumberFlowElement.defaultProps.spinTiming,
		opacityTiming = NumberFlowElement.defaultProps.opacityTiming,
		animated = NumberFlowElement.defaultProps.animated,
		respectMotionPreference = NumberFlowElement.defaultProps.respectMotionPreference,
		trend = NumberFlowElement.defaultProps.trend,
		plugins = NumberFlowElement.defaultProps.plugins,
		digits = NumberFlowElement.defaultProps.digits,

		...restProps
	} : HTMLAttributes<HTMLElement> &
		Partial<NumberFlowProps> & {
		el?: NumberFlowElement
		locales?: Intl.LocalesArgument
		format?: Format
		value: Value
		prefix?: string
		suffix?: string
		willChange?: boolean
		onanimationsstart?: () => void
		onanimationsfinish?: () => void
	} = $props()

	const elStore = writable<NumberFlowElement | undefined>()
	$effect(() => {
		$elStore = el
	})

	// You're supposed to cache these between uses:
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
	let formatter = $derived(new Intl.NumberFormat(locales, format))
	let data = $derived(formatToData(value, formatter, prefix, suffix))

	// Handle grouping. Keep as much logic in NumberFlowGroup.vue as possible
	// for better tree-shaking:
	const group = getGroupContext()
	group?.register?.(elStore)
</script>

<number-flow-svelte
	bind:this={el}
	{...restProps}
	data-will-change={willChange ? '' : undefined}
	onanimationsstart={onanimationsstart}
	onanimationsfinish={onanimationsfinish}
	__svelte_batched={Boolean(group)}
	__svelte_transformtiming={transformTiming}
	__svelte_spintiming={spinTiming}
	__svelte_opacitytiming={opacityTiming}
	__svelte_animated={animated}
	__svelte_respectmotionpreference={respectMotionPreference}
	__svelte_trend={trend}
	__svelte_plugins={plugins}
	__svelte_digits={digits}
	{data}
>
	<!-- {@html BROWSER ? undefined : renderInnerHTML(data)} -->
	{@html renderInnerHTML(data)}
</number-flow-svelte>
