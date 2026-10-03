import { getPublicApkMeta } from '$lib/server/apk'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async () => {
	const apk = getPublicApkMeta()
	return {
		apk: {
			apkReady: apk.apkReady,
			apkUrl: apk.apkUrl,
			version: apk.version,
			buildNumber: apk.buildNumber,
			sizeLabel: apk.sizeLabel,
			updatedAt: apk.updatedAt,
			androidMin: apk.androidMin,
			downloadFileName: apk.downloadFileName
		}
	}
}
