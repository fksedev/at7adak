# Server scripts (Hetzner)

## First time on server

1. Clone repo to `/var/www/at7adak` (or your path).
2. Create `.env` (see `.env.example` + `ORIGIN=https://www.at7adak.com`).
3. Configure Nginx + SSL (see `docs/push-to-hetzner-godaddy.md`).
4. Make deploy executable and run once:

```bash
cd /var/www/at7adak
chmod +x scripts/deploy.sh
./scripts/deploy.sh
pm2 startup   # follow printed command, then: pm2 save
```

## Every update (after `git push` on your Mac)

```bash
ssh root@167.233.219.37
cd /var/www/at7adak
./scripts/deploy.sh
```

GoDaddy DNS does not need changes for code updates.

## Optional

```bash
DEPLOY_BRANCH=main ./scripts/deploy.sh
pm2 logs at7adak
```
