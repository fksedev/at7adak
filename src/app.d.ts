// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Vercel {
			ip?: string | null;
			continent?: string | null;
			country?: string | null;
			region?: string | null;
			city?: string | null;
			latitude?: string | null;
			longitude?: string | null;
			timezone?: string | null;
			postalCode?: string | null;
			signature?: string | null;
		}

		interface Locals {
			token?: string;
			user?: App.UserType;
			admin?: any;
			VERCEL?: App.Vercel,
			country: string;
			city: string;
			ip: string;
		}

		interface PageData {
			USER?: any;
			VERCEL?: App.Vercel,
			country?: string;
			city?: string;
			ip?: string;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
