import { fail, redirect } from '@sveltejs/kit'
import { writeFileSync } from 'node:fs'
import { env } from '$env/dynamic/private'
import {
	ensureDownloadsDir,
	formatBytes,
	formatUpdatedAt,
	getApkPath,
	getPublicApkMeta,
	readApkMeta,
	writeApkMeta
} from '$lib/server/apk'
import type { Actions, PageServerLoad } from './$types'

const COOKIE = 'apk_update_ok'

function expectedSecret() {
	return (env.APK_UPDATE_SECRET || '').trim()
}

function isAuthed(cookies: import('@sveltejs/kit').Cookies) {
	const secret = expectedSecret()
	if (!secret) return false
	return cookies.get(COOKIE) === '1'
}

export const load: PageServerLoad = async ({ cookies }) => {
	const secretConfigured = Boolean(expectedSecret())
	const unlocked = isAuthed(cookies)
	const apk = getPublicApkMeta()

	return {
		secretConfigured,
		unlocked,
		apk: {
			version: apk.version,
			buildNumber: apk.buildNumber,
			sizeLabel: apk.sizeLabel,
			updatedAt: apk.updatedAt,
			apkReady: apk.apkReady,
			androidMin: apk.androidMin,
			apkUrl: apk.apkUrl,
			downloadFileName: apk.downloadFileName
		}
	}
}

export const actions: Actions = {
	unlock: async ({ request, cookies }) => {
		const secret = expectedSecret()
		if (!secret) {
			return fail(500, {
				message:
					'APK_UPDATE_SECRET is not set in .env. Add it, restart the server, then try again.'
			})
		}

		const form = await request.formData()
		const password = String(form.get('password') || '')
		if (password !== secret) {
			return fail(401, { message: 'Wrong update password' })
		}

		cookies.set(COOKIE, '1', {
			path: '/apk-update',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7
		})

		return { ok: true, message: 'Unlocked. You can upload APKs now.' }
	},

	lock: async ({ cookies }) => {
		cookies.delete(COOKIE, { path: '/apk-update' })
		return { ok: true, message: 'Locked.' }
	},

	upload: async ({ request, cookies }) => {
		if (!isAuthed(cookies)) {
			return fail(401, { message: 'Enter the update password first' })
		}

		const form = await request.formData()
		const version = String(form.get('version') || '').trim()
		const buildNumber = String(form.get('buildNumber') || '').trim()
		const androidMin = String(form.get('androidMin') || 'Android 7.0+').trim()
		const publish = form.get('publish') === 'on'
		const file = form.get('apk')

		if (!version) {
			return fail(400, { message: 'Version is required (e.g. 1.0.1)' })
		}
		if (!buildNumber) {
			return fail(400, { message: 'Build number is required (e.g. 21)' })
		}

		if (!(file instanceof File) || file.size === 0) {
			return fail(400, { message: 'Please choose an APK file to upload' })
		}

		if (!file.name.toLowerCase().endsWith('.apk')) {
			return fail(400, { message: 'File must be a .apk' })
		}

		if (file.size > 150 * 1024 * 1024) {
			return fail(400, { message: 'APK is too large (max 150 MB)' })
		}

		ensureDownloadsDir()
		const fileName = 'at7adak.apk'
		const buffer = Buffer.from(await file.arrayBuffer())
		writeFileSync(getApkPath(fileName), buffer)

		const meta = {
			...readApkMeta(),
			version,
			buildNumber,
			androidMin: androidMin || 'Android 7.0+',
			sizeLabel: formatBytes(buffer.length),
			updatedAt: formatUpdatedAt(),
			fileName,
			apkReady: publish
		}
		writeApkMeta(meta)

		// After a successful upload, send admin to home to verify the APK download CTA.
		redirect(303, '/')
	},

	saveMeta: async ({ request, cookies }) => {
		if (!isAuthed(cookies)) {
			return fail(401, { message: 'Enter the update password first' })
		}

		const form = await request.formData()
		const version = String(form.get('version') || '').trim()
		const buildNumber = String(form.get('buildNumber') || '').trim()
		const androidMin = String(form.get('androidMin') || '').trim()
		const publish = form.get('publish') === 'on' || form.get('publish') === 'true'

		const current = readApkMeta()
		const next = {
			...current,
			version: version || current.version,
			buildNumber: buildNumber || current.buildNumber,
			androidMin: androidMin || current.androidMin,
			apkReady: publish,
			updatedAt:
				version !== current.version || buildNumber !== current.buildNumber
					? formatUpdatedAt()
					: current.updatedAt
		}
		writeApkMeta(next)

		return {
			ok: true,
			message: publish
				? 'Published — APK button is live on the website.'
				: 'Hidden — APK button is off on the website.'
		}
	}
}
