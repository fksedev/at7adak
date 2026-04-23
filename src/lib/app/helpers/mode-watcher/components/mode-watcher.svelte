<script lang="ts">
	import { onMount } from "svelte";
	import ModeWatcherLite from "./mode-watcher-lite.svelte";
	import ModeWatcherFull from "./mode-watcher-full.svelte";
	import { modeStorageKey, themeStorageKey } from "../storage-keys.svelte";
	import {
		darkClassNames,
		disableTransitions,
		lightClassNames,
		mode,
		synchronousModeChanges,
		theme,
		themeColors,
	} from "../states.svelte";
	import type { ModeWatcherProps } from "../types";
	import { isValidMode } from "../modes";
	import { defineConfig, setMode, setTheme } from "../mode";
	import { systemPrefersMode } from "../mode-states.svelte";

	let {
		track = true,
		defaultMode = "system",
		themeColors: themeColorsProp,
		disableTransitions: disableTransitionsProp = true,
		darkClassNames: darkClassNamesProp = ["dark"],
		lightClassNames: lightClassNamesProp = [],
		defaultTheme = "",
		nonce = "",
		themeStorageKey: themeStorageKeyProp = "mode-watcher-theme",
		modeStorageKey: modeStorageKeyProp = "mode-watcher-mode",
		disableHeadScriptInjection = false,
		synchronousModeChanges: synchronousModeChangesProp = false,
	}: ModeWatcherProps = $props();

	$effect.pre(() => {
		modeStorageKey.current = modeStorageKeyProp;
	})
	$effect.pre(() => {
		themeStorageKey.current = themeStorageKeyProp;
	})
	$effect.pre(() => {
		darkClassNames.current = darkClassNamesProp;
	})
	$effect.pre(() => {
		lightClassNames.current = lightClassNamesProp;
	})
	$effect.pre(() => {
		disableTransitions.current = disableTransitionsProp;
	})
	$effect.pre(() => {
		themeColors.current = themeColorsProp;
	})
	$effect.pre(() => {
		synchronousModeChanges.current = synchronousModeChangesProp;
	})

	$effect.pre(() => {
		synchronousModeChanges.current = synchronousModeChangesProp;
	});

	$effect.pre(() => {
		disableTransitions.current = disableTransitionsProp;
	});

	$effect.pre(() => {
		themeColors.current = themeColorsProp;
	});

	$effect.pre(() => {
		darkClassNames.current = darkClassNamesProp;
	});

	$effect.pre(() => {
		lightClassNames.current = lightClassNamesProp;
	});

	$effect.pre(() => {
		modeStorageKey.current = modeStorageKeyProp;
	});

	$effect.pre(() => {
		themeStorageKey.current = themeStorageKeyProp;
	});

	$effect.pre(() => {
		mode.current;
		modeStorageKey.current;
		themeStorageKey.current;
		theme.current;
	});

	onMount(() => {
		systemPrefersMode.tracking(track);
		systemPrefersMode.query();
		const localStorageMode = localStorage.getItem(modeStorageKey.current);
		setMode(isValidMode(localStorageMode) ? localStorageMode : defaultMode);
		const localStorageTheme = localStorage.getItem(themeStorageKey.current);
		setTheme(localStorageTheme || defaultTheme);
	});

	let initConfig = $derived(defineConfig({
		defaultMode,
		themeColors: themeColorsProp,
		darkClassNames: darkClassNamesProp,
		lightClassNames: lightClassNamesProp,
		defaultTheme,
		modeStorageKey: modeStorageKeyProp,
		themeStorageKey: themeStorageKeyProp,
	}))

	const trueNonce = $derived(typeof window === "undefined" ? nonce : "");
</script>

{#if disableHeadScriptInjection}
	<ModeWatcherLite themeColors={themeColors.current} />
{:else}
	<ModeWatcherFull {trueNonce} {initConfig} themeColors={themeColors.current} />
{/if}
