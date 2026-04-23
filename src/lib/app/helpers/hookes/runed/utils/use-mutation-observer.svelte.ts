import { extract } from "./extract.svelte";
import type { MaybeGetter } from "../types";
import { defaultWindow, type ConfigurableWindow } from "../configurable-globals";

export interface UseMutationObserverOptions extends MutationObserverInit, ConfigurableWindow {}

/**
 * Watch for changes being made to the DOM tree.
 *
 * @see https://runed.dev/docs/utilities/useMutationObserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
 */
export function useMutationObserver(
	target: MaybeGetter<HTMLElement | HTMLElement[] | null | undefined>,
	callback: MutationCallback,
	options: UseMutationObserverOptions = {}
) {
	const { window = defaultWindow } = options;
	let observer: MutationObserver | undefined;

	const targets = $derived.by(() => {
		const value = extract(target);
		return new Set(value ? (Array.isArray(value) ? value : [value]) : []);
	});

	const stop = $effect.root(() => {
		$effect(() => {
			if (!targets.size || !window) return;
			observer = new window.MutationObserver(callback);
			for (const el of targets) observer.observe(el, options);

			return () => {
				observer?.disconnect();
				observer = undefined;
			};
		});
	});

	$effect(() => {
		return stop;
	});

	return {
		stop,
		takeRecords() {
			return observer?.takeRecords();
		},
	};
}

export type UseMutationObserverReturn = ReturnType<typeof useMutationObserver>;
