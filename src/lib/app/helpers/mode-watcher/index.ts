// https://github.com/svecosystem/mode-watcher

import {
	generateSetInitialModeExpression,
	createInitialModeExpression,
	resetMode,
	setMode,
	setTheme,
	toggleMode,
} from "./mode";
import { modeStorageKey, themeStorageKey } from "./storage-keys.svelte";
import { mode, theme } from "./states.svelte";
import { userPrefersMode, systemPrefersMode } from "./mode-states.svelte";

export {
	generateSetInitialModeExpression,
	createInitialModeExpression,
	setMode,
	toggleMode,
	resetMode,
	modeStorageKey,
	userPrefersMode,
	systemPrefersMode,
	mode,
	theme,
	setTheme,
	themeStorageKey,
};
export type { SystemModeValue, UserPrefersMode, SystemPrefersMode } from "./mode-states.svelte";
export { default as ModeWatcher } from "./components/mode-watcher.svelte";
