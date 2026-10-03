# AT7ADAK Website — Hetzner + GoDaddy Setup Guide

This guide explains how to host the AT7ADAK marketing website (`at7adak` SvelteKit app) on a **Hetzner** server while keeping the domain registered at **GoDaddy**.

**Official domain:** `at7adak.com` / `www.at7adak.com`

---

## What you will set up

| Piece | Where |
|--------|--------|
| Domain registration | GoDaddy (already in your name) |
| DNS records | GoDaddy DNS → point to Hetzner |
| Web server + app | Hetzner Cloud VPS (Ubuntu) |
| HTTPS certificates | Let’s Encrypt (Certbot) via Nginx |
| Android APK file | Served from the same site over HTTPS |

---

## Architecture (recommended)

```
User
  ↓ HTTPS
GoDaddy DNS  →  Hetzner VPS (Nginx)
                    ↓ proxy
                 Node.js (SvelteKit / adapter-node)
                    ↓
                 MySQL (on Hetzner or managed DB)
```

Nginx terminates SSL and serves static files (including the APK).  
Node runs the SvelteKit app (pages, API routes, dashboard).

> **Note:** The project currently uses `@sveltejs/adapter-vercel`. For Hetzner you must switch to `@sveltejs/adapter-node` before deploying (steps below).

---

## 1. Create a Hetzner server

1. Log in to [Hetzner Cloud Console](https://console.hetzner.cloud/).
2. Create a project (e.g. `at7adak`).
3. **Add Server**:
   - Location: closest to users (e.g. Falkenstein / Nuremberg / Helsinki)
   - Image: **Ubuntu 24.04**
   - Type: **CX22** or higher (2 vCPU / 4 GB is enough to start)
   - SSH key: add your public key (do not rely on password-only login)
4. Note the server **public IPv4** (and IPv6 if enabled).

Example:

```text
IPv4: 203.0.113.10
```

### Open firewall ports

In Hetzner Cloud Firewall (or `ufw` on the server), allow:

| Port | Purpose |
|------|---------|
| 22 | SSH |
| 80 | HTTP (Let’s Encrypt + redirect) |
| 443 | HTTPS |

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 2. Point GoDaddy DNS to Hetzner

1. Log in to [GoDaddy](https://www.godaddy.com/) → **My Products** → domain `at7adak.com` → **DNS**.
2. Keep nameservers as GoDaddy’s (default), unless you intentionally move DNS elsewhere.
3. Create / update these records:

| Type | Name | Value | TTL |
|------|------|--------|-----|
| **A** | `@` | `YOUR_HETZNER_IPV4` | 600 (or 1 hour) |
| **A** | `www` | `YOUR_HETZNER_IPV4` | 600 |

Optional (IPv6):

| Type | Name | Value |
|------|------|--------|
| **AAAA** | `@` | `YOUR_HETZNER_IPV6` |
| **AAAA** | `www` | `YOUR_HETZNER_IPV6` |

4. Remove or update any old A/AAAA/CNAME records that still point to Vercel or another host (they will conflict).

### Check DNS propagation

```bash
dig +short at7adak.com A
dig +short www.at7adak.com A
```

Both should return your Hetzner IPv4. DNS can take a few minutes to a few hours.

---

## 3. Prepare the server (Ubuntu)

SSH in:

```bash
ssh root@YOUR_HETZNER_IPV4
# or: ssh youruser@YOUR_HETZNER_IPV4
```

Install basics:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl ufw
```

### Install Node.js 22 (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### Install Yarn (this repo uses Yarn)

```bash
corepack enable
corepack prepare yarn@stable --activate
yarn -v
```

### Install PM2 (keeps the app running)

```bash
sudo npm install -g pm2
```

---

## 4. Switch the SvelteKit app to Node (required for Hetzner)

On your **local machine** (or in a deploy branch), change the adapter from Vercel to Node.

### 4.1 Install adapter-node

```bash
cd /path/to/at7adak
yarn add -D @sveltejs/adapter-node
# optional later: yarn remove @sveltejs/adapter-vercel
```

### 4.2 Update `svelte.config.js`

```js
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		adapter: adapter({
			out: 'build'
		}),
		typescript: {
			config: (config) => ({
				...config,
				include: [...config.include, '../drizzle.config.ts']
			})
		}
	}
};

export default config;
```

### 4.3 Build locally to verify

```bash
yarn install
yarn build
```

You should get a `build/` folder with a Node server entry.

Commit and push these changes before deploying to Hetzner.

---

## 5. Deploy the app on Hetzner

### 5.1 Clone the repo

```bash
sudo mkdir -p /var/www
sudo chown $USER:$USER /var/www
cd /var/www
git clone YOUR_GIT_REPO_URL at7adak
cd at7adak
```

### 5.2 Environment variables

```bash
nano /var/www/at7adak/.env
```

Minimum example:

```env
DATABASE_URL="mysql://user:password@127.0.0.1:3306/at7adak"
# Add any other secrets used by the app (SMTP, auth, etc.)
ORIGIN="https://www.at7adak.com"
PORT=3000
HOST=127.0.0.1
```

> `ORIGIN` should match the public HTTPS URL so cookies / redirects work correctly.

Secure the file:

```bash
chmod 600 /var/www/at7adak/.env
```

### 5.3 Install, migrate DB, build

```bash
cd /var/www/at7adak
yarn install
# Ensure MySQL is reachable, then:
yarn db:migrate
yarn build
```

### 5.4 Start with PM2

```bash
cd /var/www/at7adak
pm2 start build/index.js --name at7adak --env production
pm2 save
pm2 startup
# Run the command PM2 prints so it starts on reboot
```

Useful commands:

```bash
pm2 status
pm2 logs at7adak
pm2 restart at7adak
```

---

## 6. Configure Nginx + HTTPS

### 6.1 Nginx site config

```bash
sudo nano /etc/nginx/sites-available/at7adak
```

Paste:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name at7adak.com www.at7adak.com;

    # APK + other static files (optional direct path; SvelteKit also serves /downloads)
    location /downloads/ {
        alias /var/www/at7adak/static/downloads/;
        types {
            application/vnd.android.package-archive apk;
        }
        default_type application/vnd.android.package-archive;
        add_header Content-Disposition 'attachment; filename="at7adak.apk"';
        add_header Cache-Control "public, max-age=3600, must-revalidate";
        try_files $uri =404;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 100M;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/at7adak /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6.2 SSL with Certbot (Let’s Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d at7adak.com -d www.at7adak.com
```

Follow prompts (email, agree to terms). Certbot will:
- obtain certificates
- configure HTTPS
- set up auto-renewal

Test renewal:

```bash
sudo certbot renew --dry-run
```

Visit:

- https://at7adak.com  
- https://www.at7adak.com  

Both should load over HTTPS with a valid lock icon.

---

## 7. Host the Android APK on the website

1. Copy the signed release APK to the server:

```bash
# from your laptop
scp ./at7adak-release.apk user@YOUR_HETZNER_IPV4:/var/www/at7adak/static/downloads/at7adak.apk
```

2. On the website config (`src/lib/front/downloads.ts`), ensure:

```ts
appStoreUrl: 'https://apps.apple.com/lb/app/at7adak/id6803201608'
apkUrl: '/downloads/at7adak.apk'
apkReady: true
version: '1.0.0'
sizeLabel: '85 MB'      // update to real size
updatedAt: '1 Oct 2026' // update date
```

3. Rebuild & restart:

```bash
cd /var/www/at7adak
git pull
yarn install
yarn build
pm2 restart at7adak
```

Public APK URL:

```text
https://www.at7adak.com/downloads/at7adak.apk
```

### Easy future APK updates

1. Overwrite `static/downloads/at7adak.apk`
2. Update `version` / `sizeLabel` / `updatedAt` in `downloads.ts`
3. `yarn build && pm2 restart at7adak`

The download URL stays the same — no DNS or Nginx changes needed.

---

## 8. Recommended deploy workflow (ongoing)

```bash
ssh user@YOUR_HETZNER_IPV4
cd /var/www/at7adak
git pull origin main
yarn install
yarn db:migrate          # only when migrations changed
yarn build
pm2 restart at7adak
```

Optional: add a simple `deploy.sh` that runs those commands.

---

## 9. MySQL on Hetzner (if needed)

If the database is not already hosted elsewhere:

```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
sudo mysql
```

```sql
CREATE DATABASE at7adak CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'at7adak'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON at7adak.* TO 'at7adak'@'localhost';
FLUSH PRIVILEGES;
```

Then set `DATABASE_URL` in `.env` accordingly.

---

## 10. Checklist

- [ ] Hetzner VPS created; SSH key works  
- [ ] Firewall allows 22 / 80 / 443  
- [ ] GoDaddy A records for `@` and `www` → Hetzner IP  
- [ ] Old Vercel/other DNS records removed  
- [ ] Repo uses `@sveltejs/adapter-node`  
- [ ] `.env` configured (`DATABASE_URL`, `ORIGIN`, etc.)  
- [ ] `yarn build` succeeds on server  
- [ ] PM2 keeps `at7adak` running  
- [ ] Nginx proxies to port 3000  
- [ ] Certbot HTTPS works for `at7adak.com` + `www`  
- [ ] App Store button works  
- [ ] APK hosted at `/downloads/at7adak.apk` over HTTPS  
- [ ] `/download` and `/how-it-works` pages load  

---

## 11. Troubleshooting

| Problem | What to check |
|---------|----------------|
| Domain still shows old site | DNS A records; flush cache; wait for TTL |
| 502 Bad Gateway | `pm2 status`; app listening on `127.0.0.1:3000` |
| SSL fails | DNS must already point to Hetzner before Certbot |
| APK won’t download | File exists; Nginx `types` / permissions; `apkReady: true` |
| DB errors on start | `DATABASE_URL`; MySQL running; migrations applied |
| Mixed content / cookie issues | Set `ORIGIN=https://www.at7adak.com` |

Logs:

```bash
pm2 logs at7adak
sudo journalctl -u nginx -f
sudo tail -f /var/log/nginx/error.log
```

---

## 12. Security notes

- Prefer SSH keys; disable password SSH login when possible  
- Keep Ubuntu packages updated (`apt update && apt upgrade`)  
- Never commit `.env`, keystores, or APK signing passwords  
- Restrict MySQL to localhost unless you need remote access  
- Serve APK only over HTTPS from your own domain  

---

## Related project files

| Path | Purpose |
|------|---------|
| `src/lib/front/downloads.ts` | App Store + APK links / metadata |
| `static/downloads/at7adak.apk` | Hosted Android release APK |
| `static/downloads/README.md` | How to replace the APK |
| `vercel.json` | Used only if staying on Vercel (not needed on Hetzner) |

---

## Summary

1. **GoDaddy** owns the domain → set **A records** to Hetzner.  
2. **Hetzner** runs **Nginx + Node (PM2) + Let’s Encrypt**.  
3. Switch SvelteKit to **`adapter-node`**, build, and run on the VPS.  
4. Host the signed APK at **`/downloads/at7adak.apk`** and keep the App Store URL in `downloads.ts`.

If you want, we can next add the `adapter-node` code change in the repo and a ready-to-run `deploy.sh` for this server.
