const { readFileSync, existsSync } = require('node:fs')
const { resolve } = require('node:path')

/** Load KEY=VALUE pairs from .env into an object (production PM2 does not auto-load .env). */
function loadEnvFile(filePath) {
	const out = {}
	if (!existsSync(filePath)) return out
	for (const line of readFileSync(filePath, 'utf8').split('\n')) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith('#')) continue
		const eq = trimmed.indexOf('=')
		if (eq === -1) continue
		const key = trimmed.slice(0, eq).trim()
		let value = trimmed.slice(eq + 1).trim()
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1)
		}
		out[key] = value
	}
	return out
}

const root = __dirname
const fileEnv = loadEnvFile(resolve(root, '.env'))

/** PM2 process file — used by scripts/deploy.sh on Hetzner */
module.exports = {
	apps: [
		{
			name: 'at7adak',
			script: './build/index.js',
			cwd: root,
			instances: 1,
			exec_mode: 'fork',
			env: {
				...fileEnv,
				NODE_ENV: 'production',
				// 0.0.0.0 so Kubernetes ingress / node IP can reach the app
				HOST: fileEnv.HOST || '0.0.0.0',
				PORT: fileEnv.PORT || '3000',
				// Default SvelteKit limit is 512K — APK uploads need much more
				BODY_SIZE_LIMIT: fileEnv.BODY_SIZE_LIMIT || '160M'
			}
		}
	]
}
