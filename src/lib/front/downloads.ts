/**
 * Static download config (App Store URL, copy, site URLs).
 * Android version / build / size come from data/downloads/apk-meta.json
 * updated via /apk-update — no code deploy needed for APK updates.
 */
export const downloads = {
	appStoreUrl: 'https://apps.apple.com/lb/app/at7adak/id6803201608' as string,

	/** Fallback path; live links use at7adak(version+build).apk from apk-meta. */
	apkUrl: '/downloads/at7adak.apk',

	androidMin: 'Android 7.0+',
	iosMin: 'iOS 13.0+',
	iosDevices: 'iPhone & iPad',
	iosAvailability: 'Available on the Lebanon App Store',

	pageUrl: 'https://www.at7adak.com/download',
	siteUrl: 'https://www.at7adak.com',
	updatePageUrl: 'https://www.at7adak.com/apk-update'
} as const

export type DownloadsConfig = typeof downloads

/** Live Android fields passed from the server into Download.svelte */
export type ApkPublicMeta = {
	apkReady: boolean
	apkUrl: string
	version: string
	buildNumber: string
	sizeLabel: string
	updatedAt: string
	androidMin?: string
	/** Suggested save-as name, e.g. at7adak(1.0.0+20).apk */
	downloadFileName?: string
}

/** Saved download name shown to users, e.g. at7adak(1.0.0+20).apk */
export function apkDownloadFileName(version: string, buildNumber: string) {
	const v = String(version || '0.0.0')
		.trim()
		.replace(/[^\w.-]+/g, '-')
	const b = String(buildNumber || '0')
		.trim()
		.replace(/[^\w.-]+/g, '-')
	return `at7adak(${v}+${b}).apk`
}

export const appStoreReady = (url = downloads.appStoreUrl) => Boolean(url?.trim())
export const androidReady = (meta?: ApkPublicMeta | null) =>
	Boolean(meta?.apkReady && meta?.apkUrl)
