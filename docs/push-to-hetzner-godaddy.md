# Push AT7ADAK Website to Hetzner + Link GoDaddy Domain

Clear step-by-step guide for your setup:

- **Domain:** `at7adak.com` (GoDaddy)
- **Hosting:** Hetzner Cloud project `ata7dak` (you already have **1 Server**)
- **App:** this SvelteKit repo (`at7adak`)

---

## Overview (what happens)

```
Your laptop  →  push code to GitHub
                    ↓
Hetzner server  →  pull + build + run website (Node + Nginx)
                    ↓
GoDaddy DNS     →  point at7adak.com / www to Hetzner IP
                    ↓
HTTPS           →  Let's Encrypt SSL certificate
                    ↓
https://www.at7adak.com  goes live
```

---

## STEP 0 — Collect these values first

Before you start, write these down:

| Item | Where to find it | Your value |
|------|------------------|------------|
| Hetzner server IPv4 | Hetzner → **Servers** → click server → **IPv4** | `________________` |
| SSH user | Usually `root` (or the user you created) | `________________` |
| GitHub repo URL | GitHub → your repo → Code → HTTPS/SSH | `________________` |
| Domain | GoDaddy | `at7adak.com` |

You will use the IPv4 in GoDaddy DNS.

---

## STEP 1 — Prepare the project for Hetzner (on your Mac)

The site currently uses **Vercel adapter**. Hetzner needs **Node adapter**.

### 1.1 Switch adapter (one-time)

In the project folder:

```bash
cd /Users/faizankhaliq/Documents/Github/at7adak
npm install -D @sveltejs/adapter-node
```

Edit `svelte.config.js` so it uses Node:

```js
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		adapter: adapter({ out: 'build' }),
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

### 1.2 Commit and push to GitHub

```bash
git status
git add .
git commit -m "Prepare site for Hetzner deploy (Node adapter + download pages)"
git push origin main
```

> If you don’t have a GitHub remote yet, create a private repo and add it:
>
> ```bash
> git remote add origin git@github.com:YOUR_ORG/at7adak.git
> git push -u origin main
> ```

---

## STEP 2 — Point GoDaddy domain to Hetzner (DNS)

1. Open GoDaddy → **Domain at7adak.com** → **DNS** → **DNS Records**
2. Click **Add New Record**
3. Create **two A records**:

### Record 1 — root domain

| Field | Value |
|-------|--------|
| Type | **A** |
| Name | **@** |
| Value | **YOUR_HETZNER_IPV4** (example: `49.13.xx.xx`) |
| TTL | 1 Hour |

### Record 2 — www

| Field | Value |
|-------|--------|
| Type | **A** |
| Name | **www** |
| Value | **same Hetzner IPv4** |
| TTL | 1 Hour |

4. Click **Save** for each record

### Important

- **Do NOT** click GoDaddy “Connect Domain” / Airo (that sends traffic to GoDaddy hosting, not Hetzner)
- If any old **A** or **CNAME** exists for `@` or `www`, edit/delete them so only Hetzner IPs remain
- Leave MX records alone if you use email on this domain

### Check DNS (from your Mac)

```bash
dig +short at7adak.com A
dig +short www.at7adak.com A
```

Both should show your Hetzner IP.  
DNS can take **5–60 minutes**. Continue server setup while waiting.

---

## STEP 3 — Connect to Hetzner server (SSH)

On your Mac:

```bash
ssh root@YOUR_HETZNER_IPV4
```

If you use a key:

```bash
ssh -i ~/.ssh/your_key root@YOUR_HETZNER_IPV4
```

First time: type `yes` to accept the host fingerprint.

---

## STEP 4 — Install software on the server

Run these on the Hetzner server:

```bash
apt update && apt upgrade -y
apt install -y nginx git curl ufw

# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Process manager
npm install -g pm2

# Firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

Check:

```bash
node -v
npm -v
nginx -v
```

---

## STEP 5 — Put the website code on the server

```bash
mkdir -p /var/www
cd /var/www
git clone YOUR_GITHUB_REPO_URL at7adak
cd /var/www/at7adak
```

### 5.1 Create production `.env`

```bash
nano /var/www/at7adak/.env
```

Paste (edit values):

```env
DATABASE_URL="mysql://USER:PASSWORD@127.0.0.1:3306/at7adak"
ORIGIN="https://www.at7adak.com"
HOST=127.0.0.1
PORT=3000
```

Save: `Ctrl+O`, Enter, `Ctrl+X`

```bash
chmod 600 /var/www/at7adak/.env
```

> If MySQL is not ready yet, you can still deploy marketing pages, but set a valid `DATABASE_URL` before using dashboard/newsletter APIs.

### 5.2 Install + build

```bash
cd /var/www/at7adak
npm install --ignore-scripts
npx svelte-kit sync
npm run build
```

### 5.3 Build and start (use deploy script)

```bash
cd /var/www/at7adak
chmod +x scripts/deploy.sh
./scripts/deploy.sh
pm2 startup
# run the command PM2 prints, then: pm2 save
pm2 status
```

App listens on `127.0.0.1:3000` (Nginx exposes it on 443).

---

## STEP 6 — Connect domain traffic with Nginx

```bash
nano /etc/nginx/sites-available/at7adak
```

Paste:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name at7adak.com www.at7adak.com;

    client_max_body_size 100M;

    # Do NOT alias /downloads/ to a static folder — APK is uploaded via
    # /dashboard/apk and served by the Node app at /downloads/at7adak.apk

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
    }
}
```

Enable site:

```bash
ln -sf /etc/nginx/sites-available/at7adak /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

### Test HTTP (before SSL)

From your Mac (once DNS has updated):

```bash
curl -I http://at7adak.com
curl -I http://www.at7adak.com
```

You should get a response from Nginx/your app (not GoDaddy parking).

---

## STEP 7 — Add HTTPS (SSL) — required for APK + App Store trust

On the server (DNS must already point to Hetzner):

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d at7adak.com -d www.at7adak.com
```

- Enter email
- Agree to terms
- Choose redirect HTTP → HTTPS (**yes**)

Test:

```bash
curl -I https://www.at7adak.com
```

Open in browser:

- https://at7adak.com  
- https://www.at7adak.com  

Both should show the padlock.

---

## STEP 8 — Verify website pages

Check:

| URL | Expected |
|-----|----------|
| https://www.at7adak.com/ | Home |
| https://www.at7adak.com/download | Download page |
| https://www.at7adak.com/how-it-works | How It Works |
| App Store button | Opens Apple listing |

### Android APK (when ready)

On server (or scp from Mac):

```bash
# from Mac:
scp ./your-release.apk root@YOUR_HETZNER_IPV4:/var/www/at7adak/static/downloads/at7adak.apk
```

Then on Mac, in repo set `apkReady: true` in `src/lib/front/downloads.ts`, commit, push, and on server:

```bash
cd /var/www/at7adak
git pull
npm install --ignore-scripts
npm run build
pm2 restart at7adak
```

APK URL:

```text
https://www.at7adak.com/downloads/at7adak.apk
```

---

## STEP 9 — Future updates (how you “push” again)

Whenever you change the website:

**On your Mac**

```bash
cd /Users/faizankhaliq/Documents/Github/at7adak
git add .
git commit -m "Update website"
git push origin main
```

**On Hetzner (one command)**

```bash
ssh root@167.233.219.37
cd /var/www/at7adak
./scripts/deploy.sh
```

The script runs: `git pull` → `npm install` → `npm run build` → `pm2 restart`.

First time only:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
pm2 startup   # run the command it prints, then: pm2 save
```

See also `scripts/README.md`. **GoDaddy DNS is unchanged** on each deploy.

---

## Checklist (print / tick)

- [ ] Got Hetzner IPv4  
- [ ] Switched to `adapter-node` and pushed to GitHub  
- [ ] GoDaddy A records: `@` + `www` → Hetzner IP  
- [ ] DNS check shows correct IP (`dig`)  
- [ ] SSH into server works  
- [ ] Node, Nginx, PM2 installed  
- [ ] Repo cloned to `/var/www/at7adak`  
- [ ] `.env` created with `ORIGIN=https://www.at7adak.com`  
- [ ] `npm run build` succeeded  
- [ ] `pm2 status` shows `at7adak` online  
- [ ] Nginx proxy configured + reloaded  
- [ ] Certbot SSL installed  
- [ ] https://www.at7adak.com loads  
- [ ] /download and /how-it-works work  

---

## Common problems

| Problem | Fix |
|---------|-----|
| Domain still shows GoDaddy parking | DNS not updated yet, or A records wrong; wait / recheck `dig` |
| `certbot` fails | DNS must already point to this server; wait and retry |
| 502 Bad Gateway | `pm2 status` — app not running; restart `pm2 restart at7adak` |
| SSH refused | Wrong IP, firewall blocking 22, or server stopped in Hetzner |
| Site works on IP but not domain | DNS not pointing yet |
| Old Vercel site still shows | Delete old A/CNAME in GoDaddy; flush browser cache |

Useful logs:

```bash
pm2 logs at7adak
tail -f /var/log/nginx/error.log
```

---

## Related docs in this repo

- `docs/hetzner-godaddy-setup.md` — fuller technical reference  
- `docs/local-dev.md` — run locally for review  
- `docs/apk-updates.md` — **upload APK from dashboard (no code changes)**  
- `src/lib/front/downloads.ts` — App Store URL (static)  
- `data/downloads/` — uploaded APK + `apk-meta.json`  
- `/dashboard/apk` — admin APK update page 

---

## Short version

1. **Push code** to GitHub (with Node adapter)  
2. **GoDaddy DNS** → A `@` + A `www` = Hetzner IP  
3. **SSH Hetzner** → clone, `.env`, build, PM2  
4. **Nginx** reverse proxy to port 3000  
5. **Certbot** HTTPS  
6. Open **https://www.at7adak.com**
