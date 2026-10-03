import { createReadStream, existsSync, statSync } from 'node:fs'
import { Readable } from 'node:stream'
import { error } from '@sveltejs/kit'
import { apkDownloadFileName, getApkPath, getPublicApkMeta, readApkMeta } from '$lib/server/apk'
import type { RequestHandler } from './$types'

/**
 * Accepts:
 * - /downloads/at7adak.apk (stable)
 * - /downloads/at7adak(1.0.0+20).apk (version + build from upload form)
 * File on disk stays at7adak.apk; the URL / Content-Disposition name follows meta.
 */
function isAllowedApkName(name: string, versionedName: string) {
	if (name === 'at7adak.apk') return true
	if (name === versionedName) return true
	return /^at7adak\([^/\\]+\)\.apk$/i.test(name)
}

export const GET: RequestHandler = async ({ params }) => {
	const requested = params.name || ''
	const meta = readApkMeta()
	const versionedName = apkDownloadFileName(meta.version, meta.buildNumber)

	if (!isAllowedApkName(requested, versionedName)) {
		error(404, 'Not found')
	}

	const fileName = meta.fileName || 'at7adak.apk'
	const path = getApkPath(fileName)

	if (!existsSync(path)) {
		error(404, 'APK not found')
	}

	const publicMeta = getPublicApkMeta()
	if (!publicMeta.apkReady) {
		error(404, 'APK not published')
	}

	const stats = statSync(path)
	const nodeStream = createReadStream(path)
	const webStream = Readable.toWeb(nodeStream) as ReadableStream
	// Always use current version+build from upload meta for the saved filename
	const downloadName = versionedName

	return new Response(webStream, {
		headers: {
			'Content-Type': 'application/vnd.android.package-archive',
			'Content-Disposition': `attachment; filename="${downloadName}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
			'Content-Length': String(stats.size),
			'Cache-Control': 'public, max-age=3600, must-revalidate',
			'X-Content-Type-Options': 'nosniff'
		}
	})
}
