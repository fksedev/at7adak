# Run AT7ADAK website locally

Use this to review Home, Download, and How It Works on your machine.

## Requirements

- Node.js 20+ (you already have Node on this Mac)
- npm (comes with Node)

## 1. Install dependencies

From the project root:

```bash
cd /Users/faizankhaliq/Documents/Github/at7adak
npm install --ignore-scripts
npx svelte-kit sync
```

`--ignore-scripts` skips the postinstall DB migration (needed only for dashboard/API, not for reviewing marketing pages).

If you prefer Yarn:

```bash
corepack enable
corepack prepare yarn@stable --activate
yarn install
```

## 2. Environment file (optional for marketing pages)

Marketing pages (`/`, `/download`, `/how-it-works`) work without a real database.

If you also want newsletter / dashboard / APIs:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="mysql://user:password@host:port/db-name"
```

Then run migrations when the DB is ready:

```bash
npm run db:migrate
```

## 3. Start the dev server

```bash
npm run dev
```

Or open the browser automatically:

```bash
npm run dev -- --open
```

Default URL:

```text
http://localhost:5173
```

## 4. Pages to review

| Page | URL |
|------|-----|
| Home | http://localhost:5173/ |
| Download | http://localhost:5173/download |
| How It Works | http://localhost:5173/how-it-works |

## 5. What to check

**Download (`/download`)**
- App Store button opens: https://apps.apple.com/lb/app/at7adak/id6803201608
- Android APK button stays disabled until you add the APK (see below)
- QR code, install steps, FAQ, responsive layout

**How It Works (`/how-it-works`)**
- 7 steps + download CTA
- Nav links: Home · How It Works · Download

**Home (`/`)**
- Download App CTA
- Store buttons
- Link to full How It Works guide

## 6. Enable Android APK button (when you have the file)

1. Copy signed APK to:

```text
static/downloads/at7adak.apk
```

2. In `src/lib/front/downloads.ts` set:

```ts
apkReady: true
version: '1.0.0'
sizeLabel: '85 MB'       // real size
updatedAt: '1 Oct 2026'  // real date
```

3. Refresh the browser (Vite hot-reloads most changes).

## Useful commands

```bash
npm run dev       # development server
npm run build     # production build
npm run preview   # preview production build locally
npm run check     # TypeScript / Svelte check
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Cannot find module` / missing `.svelte-kit` | Run `npm install --ignore-scripts && npx svelte-kit sync` |
| Port 5173 in use | `npm run dev -- --port 5174` |
| DB / migrate errors on install | Use `--ignore-scripts` until `.env` + MySQL are ready |
| App Store / APK buttons wrong | Edit `src/lib/front/downloads.ts` |
