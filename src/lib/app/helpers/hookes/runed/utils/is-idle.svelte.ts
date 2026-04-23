import { extract } from "./extract.svelte";
import { useDebounce } from "./use-debounce.svelte";
import type { MaybeGetter } from "../types";
import { useEventListener } from "./use-event-listener.svelte";
import {
	defaultWindow,
	type ConfigurableDocument,
	type ConfigurableWindow,
} from "../configurable-globals";

type WindowEvent = keyof WindowEventMap;

export type IsIdleOptions = ConfigurableDocument &
	ConfigurableWindow & {
		/**
		 * The timeout in milliseconds before the idle state is set to `true`. Defaults to 60 seconds.
		 *
		 * @default 60000
		 */
		timeout?: MaybeGetter<number>;
		/**
		 * Detect document visibility changes
		 *
		 * @default false
		 */
		detectVisibilityChanges?: MaybeGetter<boolean>;
		/**
		 * The initial state of the idle property
		 *
		 * @default false
		 */
		initialState?: boolean;
	};

const DEFAULT_EVENTS = [
	"keypress",
	"mousemove",
	"touchmove",
	"click",
	"scroll",
] satisfies WindowEvent[];

const DEFAULT_OPTIONS = {
	initialState: false,
	timeout: 60000,
} satisfies IsIdleOptions;

/**
 * Tracks whether the user is being inactive.
 * @see {@link https://runed.dev/docs/utilities/is-idle}
 */
export class IsIdle {
	#current: boolean = $state(false);
	#lastActive = $state(Date.now());

	constructor(_options?: IsIdleOptions) {
		const opts = {
			...DEFAULT_OPTIONS,
			..._options,
		};
		const window = opts.window ?? defaultWindow;
		const document = opts.document ?? window?.document;

		const timeout = $derived(extract(opts.timeout));
		// const events = $derived(extract(opts.events));
		const events = DEFAULT_EVENTS;
		const detectVisibilityChanges = $derived(extract(opts.detectVisibilityChanges));
		this.#current = opts.initialState;

		const debouncedReset = useDebounce(
			() => {
				this.#current = true;
			},
			() => timeout
		);

		debouncedReset();

		const handleActivity = () => {
			this.#current = false;
			this.#lastActive = Date.now();
			debouncedReset();
		};

		useEventListener(
			() => window,
			events,
			() => {
				handleActivity();
			},
			{ passive: true }
		);

		$effect(() => {
			if (!detectVisibilityChanges || !document) return;
			useEventListener(document, ["visibilitychange"], () => {
				if (document.hidden) return;
				handleActivity();
			});
		});
	}

	get lastActive(): number {
		return this.#lastActive;
	}

	get current(): boolean {
		return this.#current;
	}
}
