
import { defaultDocument } from "./configurable-globals";
import type { MaybeGetter } from "./types";

export { BROWSER as browser } from "esm-env";
/**
 * Get nth item of Array. Negative for backward
 */
export function at<T>(array: readonly T[], index: number): T | undefined {
	const len = array.length;
	if (!len) return undefined;

	if (index < 0) index += len;

	return array[index];
}

export function last<T>(array: readonly T[]): T | undefined {
	return array[array.length - 1];
}


export function getActiveElement(document: DocumentOrShadowRoot): Element | null {
	let activeElement = document.activeElement;

	while (activeElement?.shadowRoot) {
		const node = activeElement.shadowRoot.activeElement;
		if (node === activeElement) break;
		else activeElement = node;
	}

	return activeElement;
}

export function getOwnerDocument(
	node: Element | null | undefined,
	fallback = defaultDocument
): Document | undefined {
	return node?.ownerDocument ?? fallback;
}

export function isOrContainsTarget(node: Element, target: Element) {
	return node === target || node.contains(target);
}

export function noop(): void {}

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
	return value !== null && typeof value === "object";
}

export function isElement(value: unknown): value is Element {
	return value instanceof Element;
}

export function get<T>(value: MaybeGetter<T>): T {
	if (isFunction(value)) {
		return value();
	}

	return value;
}

export async function sleep(ms = 0): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
