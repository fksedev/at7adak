# APK updates (no website code / no MySQL)

## Page

| Env | URL |
|-----|-----|
| Local | http://localhost:5173/apk-update |
| Live | https://www.at7adak.com/apk-update |

Protected only by `APK_UPDATE_SECRET` in `.env` (not dashboard login).

## Local test

1. In `.env`:
   ```env
   APK_UPDATE_SECRET=at7adak-local-update
   ```
2. Restart: `npm run dev`
3. Open http://localhost:5173/apk-update
4. Enter password: `at7adak-local-update`
5. Upload APK + fill **Version** and **Build number** → **Upload & update website**
6. Check http://localhost:5173/download

## Client / production use

1. Set a strong `APK_UPDATE_SECRET` on the Hetzner server `.env`
2. Restart the app (`./scripts/deploy.sh` or `pm2 restart at7adak`)
3. Open `/apk-update`, unlock with that password
4. Each new Android release:
   - Upload signed APK
   - Set version (e.g. `1.0.2`)
   - Set build number (e.g. `22`)
   - Publish

Public Download page updates automatically.  
Stable file URL: `/downloads/at7adak.apk`

No developer / redeploy needed for routine APK swaps.
