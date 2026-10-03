/** PM2 process file — used by scripts/deploy.sh on Hetzner */
module.exports = {
	apps: [
		{
			name: 'at7adak',
			script: './build/index.js',
			cwd: __dirname,
			instances: 1,
			exec_mode: 'fork',
			env_file: '.env',
			env: {
				NODE_ENV: 'production',
				HOST: '127.0.0.1',
				PORT: '3000'
			}
		}
	]
};
