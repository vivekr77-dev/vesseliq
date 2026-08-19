# VesselIQ

Professional React-based vessel acquisition analysis platform.

## Architecture

**Docker Deployment:**
- Single Dockerfile builds frontend + backend
- Frontend built to `backend/public/`
- One Railway service = API + Web app

## Structure

```
vesseliq/
├── Dockerfile           (builds both frontend + backend)
├── backend/
│   ├── server.js        (Express API)
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── .gitignore
```

## Demo Credentials

- Username: `raffles`
- Password: `opportunities@2026`

## Deployment to Railway

### Step 1: Create PostgreSQL Database

1. Go to railway.app → **"+ New"** → **"Database"** → **"PostgreSQL"**
2. Wait for status = "Up" ✅
3. Click PostgreSQL card → **"Connect"** tab
4. Copy **DATABASE_PRIVATE_URL** (Railway private network)
5. **Save it**

### Step 2: Deploy with Docker

1. Go to railway.app → **"+ New"** → **"Deploy from GitHub"**
2. Select: `vivekr77-dev/vesseliq`
3. Railway auto-detects Dockerfile ✅
4. Click **"Deploy"**

### Step 3: Add Environment Variables

Go to **"Variables"** tab and add:

```
DATABASE_PRIVATE_URL=[paste from PostgreSQL Connect tab]
SECRET_KEY=your-super-secret-key-min-32-chars
NODE_ENV=production
```

Click **"Save"**. Railway redeploys automatically.

### Step 4: Verify Status

1. Check **Deployments** tab
2. Wait for status = "Up" (green) ✅
3. Copy the **Public URL**
4. Open it in browser
5. Login: raffles / opportunities@2026

## Environment Variables

**Required:**
- `DATABASE_PRIVATE_URL` - PostgreSQL private URL (Railway recommended)
- `SECRET_KEY` - Random secure key (min 32 chars)

**Optional:**
- `DATABASE_URL` - Used if DATABASE_PRIVATE_URL not set
- `NODE_ENV` - Set to `production`
- `PORT` - Default: 5000

## How It Works

**DATABASE_PRIVATE_URL** is Railway's private network connection - it's:
- ✅ Secure (internal network only)
- ✅ Faster (no internet hop)
- ✅ Automatic (Railway injects it)

The backend code checks for it first:
```javascript
const dbUrl = process.env.DATABASE_PRIVATE_URL || process.env.DATABASE_URL
```

## Features

- ✅ React 18 + Vite
- ✅ Express.js API
- ✅ PostgreSQL database
- ✅ JWT authentication
- ✅ Dark mode
- ✅ Docker deployment
- 🔜 Portfolio analysis
- 🔜 Multi-vessel support
- 🔜 PDF/Excel export

---

**Version:** 1.0.0  
**Status:** Production Ready  
**Deployment Time:** 5 minutes
