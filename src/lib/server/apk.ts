import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

export type ApkMeta = {
	version: string
	buildNumber: string
	sizeLabel: string
	updatedAt: string
	apkReady: boolean
	fileName: string
	androidMin: string
}

const DEFAULT_META: ApkMeta = {
	version: '1.0.0',
	buildNumber: '1',
	sizeLabel: '—',
	updatedAt: '—',
	apkReady: false,
	fileName: 'at7adak.apk',
	androidMin: 'Android 7.0+'
}

/** Writable folder on the server (survives deploys if not wiped). */
export function getDownloadsDir() {
	return join(process.cwd(), 'data', 'downloads')
}

export function getApkPath(fileName = 'at7adak.apk') {
	return join(getDownloadsDir(), fileName)
}

export function getMetaPath() {
	return join(getDownloadsDir(), 'apk-meta.json')
}

export function ensureDownloadsDir() {
	const dir = getDownloadsDir()
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
	return dir
}

export function readApkMeta(): ApkMeta {
	try {
		const path = getMetaPath()
		if (!existsSync(path)) return { ...DEFAULT_META }
		const raw = JSON.parse(readFileSync(path, 'utf8')) as Partial<ApkMeta>
		return { ...DEFAULT_META, ...raw }
	} catch {
		return { ...DEFAULT_META }
	}
}

export function writeApkMeta(meta: ApkMeta) {
	ensureDownloadsDir()
	writeFileSync(getMetaPath(), JSON.stringify(meta, null, '\t') + '\n', 'utf8')
}

export function apkFileExists(fileName = 'at7adak.apk') {
	return existsSync(getApkPath(fileName))
}

/** Live public meta: JSON file + whether the APK is actually on disk. */
export function getPublicApkMeta() {
	const meta = readApkMeta()
	const onDisk = apkFileExists(meta.fileName || 'at7adak.apk')
	const apkReady = Boolean(meta.apkReady && onDisk)
	const downloadFileName = apkDownloadFileName(meta.version, meta.buildNumber)
	const cacheBust = apkReady
		? `?v=${encodeURIComponent(meta.version)}-${encodeURIComponent(meta.buildNumber)}-${encodeURIComponent(meta.updatedAt)}`
		: ''
	return {
		...meta,
		apkReady,
		/** Public URL uses versioned name so browsers save as at7adak(1.0.0+20).apk */
		apkUrl: `/downloads/${encodeURIComponent(downloadFileName)}${cacheBust}`,
		downloadFileName,
		apkBytes: onDisk ? statSync(getApkPath(meta.fileName || 'at7adak.apk')).size : 0
	}
}

export function formatBytes(bytes: number) {
	if (!bytes || bytes < 0) return '—'
	const mb = bytes / (1024 * 1024)
	if (mb >= 10) return `${Math.round(mb)} MB`
	return `${mb.toFixed(1)} MB`
}

export function formatUpdatedAt(date = new Date()) {
	return date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	})
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
