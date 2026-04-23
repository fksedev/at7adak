import type { ConfigurableWindow } from "../configurable-globals";
import type { MaybeElementGetter } from "../types";
import {
	useIntersectionObserver,
	type UseIntersectionObserverOptions,
} from "./use-intersection-observer.svelte";

export type IsInViewportOptions = ConfigurableWindow & UseIntersectionObserverOptions;

/**
 * Tracks if an element is visible within the current viewport.
 *
 * @see {@link https://runed.dev/docs/utilities/is-in-viewport}
 */
export class IsInViewport {
	#isInViewport = $state(false);

	constructor(node: MaybeElementGetter, options?: IsInViewportOptions) {
		useIntersectionObserver(
			node,
			(intersectionObserverEntries) => {
				let isIntersecting = this.#isInViewport;
				let latestTime = 0;
				for (const entry of intersectionObserverEntries) {
					if (entry.time >= latestTime) {
						latestTime = entry.time;
						isIntersecting = entry.isIntersecting;
					}
				}
				this.#isInViewport = isIntersecting;
			},
			options
		);
	}

	get current() {
		return this.#isInViewport;
	}
}
