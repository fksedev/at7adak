// <svelte:body use:useLockScroll={locked} />

export const useLockScroll = (node, param) => {
	let locked = false;
	let unsub;

	if (node.isSameNode(document)) {
		node = document.documentElement;
	}

	function lock() {
		const scrollBarWidth = window.innerWidth - document.body.clientWidth;
		node.style.paddingRight = `${scrollBarWidth}px`;
		node.style.overflow = 'hidden';
	}

	function unlock() {
		node.style.overflow = '';
		node.style.paddingRight = '';
	}

	function updateLockState(_locked) {
		if (_locked !== locked) {
			locked = _locked;
			locked ? lock() : unlock();
			node.dispatchEvent(new CustomEvent('lockscroll:toggle', { detail: { locked } }));
		}
	}

	function processParameter(_param) {
		if (typeof _param === 'boolean') {
			updateLockState(_param);
		} else {
			unsub = _param.subscribe(updateLockState);
		}
	}

	processParameter(param);

	return {
		update(update) {
			unsub?.();
			processParameter(update);
		},
		destroy() {
			unsub?.();
		},
	};
}
