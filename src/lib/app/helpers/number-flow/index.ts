// https://number-flow.barvian.me/svelte
// https://github.com/barvian/number-flow

import {
	canAnimate as _canAnimate,
	prefersReducedMotion as _prefersReducedMotion
} from './lib/lite'
import { onMount } from 'svelte'
import { derived, readable } from 'svelte/store'

export type { Value, Format, Trend } from './lib/lite'
export * from './lib/plugins'
export { default as NumberFlowGroup } from './NumberFlowGroup.svelte'
export { default as NumberFlow } from './NumberFlow.svelte'

const canAnimate = readable(false, (set) => {
	onMount(() => {
		set(_canAnimate)
	})
})

const prefersReducedMotion = readable(false, (set) => {
	onMount(() => {
		set(_prefersReducedMotion?.matches ?? false)
		const onChange = ({ matches }: MediaQueryListEvent) => {
			set(matches)
		}
		_prefersReducedMotion?.addEventListener('change', onChange)
		return () => {
			_prefersReducedMotion?.removeEventListener('change', onChange)
		}
	})
})

const canAnimateWithPreference = derived(
	[canAnimate, prefersReducedMotion],
	([canAnimate, prefersReducedMotion]) => canAnimate && !prefersReducedMotion
)

export const getCanAnimate = ({ respectMotionPreference = true } = {}) =>
	respectMotionPreference ? canAnimateWithPreference : canAnimate
