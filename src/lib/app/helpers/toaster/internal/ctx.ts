import { SonnerState } from '../toast-state.svelte';
import { Context } from './context'

export const richColorsContext = new Context<{ setRichColors: (value: boolean) => void }>(
	'richColorsContext'
);

export const sonnerContext = new Context<SonnerState>('<Toaster/>');
