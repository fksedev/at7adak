import { tick } from 'svelte';

export function useDownload(
	node: HTMLElement,
	params: { blob: Blob; filename: string }
) {
	const click = async () => {
		const { blob, filename } = params;
		try {
			const anchor: HTMLAnchorElement = document.createElement('a');
			const url: string = URL.createObjectURL(blob);
			anchor.href = url;
			anchor.download = filename || '';
			document.body.appendChild(anchor);

			anchor.click();
			await tick();

			document.body.removeChild(anchor);
			URL.revokeObjectURL(url);
		} catch (e) {}
	};

	node.addEventListener('click', click, true);

	return {
		update: (newParams) => params = Object.assign(params, newParams),
		destroy: () => node.removeEventListener('click', click, true)
	};
}
