// https://www.neodrag.dev/docs/svelte

import { draggable as core_draggable, type DragEventData, type DragOptions } from './core';

export interface ActionReturn<
	Parameter = undefined,
	Attributes extends Record<string, any> = Record<never, any>,
> {
	update?: (parameter: Parameter) => void;
	destroy?: () => void;
	/**
	 * ### DO NOT USE THIS
	 * This exists solely for type-checking and has no effect at runtime.
	 * Set this through the `Attributes` generic instead.
	 */
	$$_attributes?: Attributes;
}

export interface Action<
	Element = HTMLElement,
	Parameter = undefined,
	Attributes extends Record<string, any> = Record<never, any>,
> {
	<Node extends Element>(
		...args: undefined extends Parameter
			? [node: Node, parameter?: Parameter]
			: [node: Node, parameter: Parameter]
	): void | ActionReturn<Parameter, Attributes>;
}

export const draggable = core_draggable as Action<
	HTMLElement,
	DragOptions | undefined,
	{
		'on:neodrag:start': (e: CustomEvent<DragEventData>) => void;
		'on:neodrag': (e: CustomEvent<DragEventData>) => void;
		'on:neodrag:end': (e: CustomEvent<DragEventData>) => void;
	}
>;

export type {
	DragAxis,
	DragBounds,
	DragBoundsCoords,
	DragEventData,
	DragOptions,
} from './core';
