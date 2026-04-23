import type { MaybeElementGetter } from "../types";
import {
	ActiveElement,
	type ActiveElementOptions,
} from "./active-element.svelte";
import { extract } from "./extract.svelte";

export interface IsFocusWithinOptions extends ActiveElementOptions {}

/**
 * Tracks whether the focus is within a target element.
 * @see {@link https://runed.dev/docs/utilities/is-focus-within}
 */
export class IsFocusWithin {
	readonly #node: MaybeElementGetter;
	readonly #activeElement: ActiveElement;

	constructor(node: MaybeElementGetter, options: IsFocusWithinOptions = {}) {
		this.#node = node;
		this.#activeElement = new ActiveElement(options);
	}

	readonly current = $derived.by(() => {
		const node = extract(this.#node);
		if (node == null) return false;
		return node.contains(this.#activeElement.current);
	});
}
