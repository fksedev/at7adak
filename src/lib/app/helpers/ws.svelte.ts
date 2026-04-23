import { writable } from 'svelte/store'

// PRICES
export const _priceSOL = writable<number>(0)
export const _priceBTC = writable<number>(0)
export const _priceETH = writable<number>(0)
export const _priceUSDT = writable<number>(0)

export function createSocket<T>(
	url: string | URL,
	options?: {
		name?: string;
		protocols?: string | string[];
		onOpen?: (event: Event) => void;
		onError?: (error: Event) => void;
		onMessage?: (data: T, requests: T[], event: Event) => void;
	}
) {
	let requests = $state<T[]>([]);
	let latest = $derived(requests.at(requests.length - 1));
	let websocket: WebSocket | null = null;

	$effect(() => {
		websocket = new WebSocket(url, options?.protocols)

		websocket.onopen = (event) => {
			// console.log(`${options?.name || "Websocket"} connected!`);
			if (options?.onOpen) options.onOpen(event);
		};

		websocket.onerror = (error) => {
			// console.log(`${options?.name || "Websocket"} error:`, error);
			if (options?.onError) options.onError(error);
		};

		websocket.onmessage = (event) => {
			const data = JSON.parse(event.data) as T;
			requests = requests.concat(data);
			if (options?.onMessage) options.onMessage(data, requests, event);
		};

		return () => {
			if (websocket) websocket.close();
		}
	});

	return {
		get requests() { return requests },
		get latest() { return latest },
		close() {
			if (websocket) websocket.close();
		},
		send(data: T) {
			if (!websocket) throw new Error("No websocket connection");
			if (websocket.readyState !== websocket.OPEN) throw new Error("No websocket connection");
			websocket.send(JSON.stringify(data));
		}
	};
}

export const krakenPricesWSS = () => {
	const socket = createSocket('wss://ws.kraken.com', {
		name: 'krakenPrices',
		onOpen: () => {
			socket.send({
				"event": "subscribe",
				"pair": [
					"BTC/USD", "ETH/USD", "SOL/USD", "USDT/USD"
				],
				"subscription": {
					"name": "ticker"
				}
			})
		},
		onMessage: (data, requests, event) => {
			if(Array.isArray(data)) {
				// console.log(data)
				if(data[3] === 'SOL/USD') {
					_priceSOL.set(data[1].a[0])
				}
				if(data[3] === 'BTC/USD' || data[3] === 'XBT/USD') {
					_priceBTC.set(data[1].a[0])
				}
				if(data[3] === 'ETH/USD') {
					_priceETH.set(data[1].a[0])
				}
				if(data[3] === 'USDT/USD') {
					_priceUSDT.set(data[1].a[0])
				}
			}
		},
	})
} 
