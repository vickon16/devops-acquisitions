# 🐳 Docker + Neon Database Guide

This document explains how to run **devops-acquisitions** locally with **Neon Local** and deploy it to production with **Neon Cloud**.

---

## Prerequisites

| Tool                     | Version                                        |
| ------------------------ | ---------------------------------------------- |
| Docker + Docker Compose  | v2.20+                                         |
| Neon account             | [console.neon.tech](https://console.neon.tech) |
| Node.js (host, optional) | 22+                                            |

---

## How `DATABASE_URL` switches between environments

| Environment               | `DATABASE_URL` points to                  | Managed by                                          |
| ------------------------- | ----------------------------------------- | --------------------------------------------------- |
| **Dev (Docker)**          | `neon-local:5432` (proxy container)       | `docker-compose.dev.yml` overrides it automatically |
| **Host (bare-metal dev)** | `localhost:5432` if Neon Local is running | `.env.development`                                  |
| **Production**            | Neon Cloud endpoint (`*.neon.tech`)       | `.env.production` / CI/CD secrets                   |

---

## 🖥️ Local Development (Docker + Neon Local)

Neon Local spins up a lightweight proxy that creates a **temporary ephemeral branch** of your Neon project. The branch is deleted automatically when the container stops — giving you a clean database on every session.

### Step 1 – Get your Neon credentials

1. Go to [console.neon.tech](https://console.neon.tech) → your project.
2. **API Key**: _Account → API Keys → New API Key_
3. **Project ID**: shown in _Project Settings_ or the URL.
4. **Parent Branch ID**: `Settings → Branches`. Copy the ID of `main` (format: `br-xxx`).
5. **DB Password**: go to _Dashboard → Connection string_, copy the password portion.

### Step 2 – Populate `.env.development`

```bash
cp .env.example .env.development
```

Fill in the four Neon values:

```dotenv
NEON_API_KEY=<your_api_key>
NEON_PROJECT_ID=<your_project_id>
PARENT_BRANCH_ID=<br-your-main-branch-id>
NEON_DB_PASSWORD=<your_neondb_owner_password>
```

> ℹ️ `DATABASE_URL` in `.env.development` is only used when running **outside** Docker.
> Inside Docker Compose, it's overridden to point at the `neon-local` service.

### Step 3 – Start the stack

```bash
docker compose -f docker-compose.dev.yml up --build
```

What happens:

1. `neon-local` starts and creates an ephemeral branch forked from `PARENT_BRANCH_ID`.
2. The `app` waits for the proxy to be healthy, then connects on `neon-local:5432`.
3. The app runs with `node --watch` — source changes in `./src` hot-reload automatically.

### Step 4 – Run database migrations

```bash
# In a separate terminal – runs drizzle-kit inside the running app container
docker compose -f docker-compose.dev.yml exec app npm run db:migrate
```

### Step 5 – Access the app

```
http://localhost:4000
```

### Step 6 – Stop and clean up

```bash
docker compose -f docker-compose.dev.yml down
```

The **ephemeral Neon branch is automatically deleted** — no manual cleanup needed.

---

## 🚀 Production Deployment (Neon Cloud)

In production, there is **no Neon Local** — the app connects directly to Neon Cloud.

### Step 1 – Configure `.env.production`

```bash
cp .env.example .env.production
```

Set your real Neon Cloud URL:

```dotenv
DATABASE_URL="postgresql://neondb_owner:<password>@ep-<id>.neon.tech/neondb?sslmode=require&channel_binding=require"
NODE_ENV=production
JWT_SECRET=<long-random-secret>
```

> ⚠️ **Never commit `.env.production` with real secrets to Git.**
> In CI/CD (e.g. GitHub Actions), inject via repository secrets:
>
> ```yaml
> env:
>   DATABASE_URL: ${{ secrets.DATABASE_URL }}
>   JWT_SECRET: ${{ secrets.JWT_SECRET }}
> ```

### Step 2 – Build and run

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### Step 3 – Run migrations against production DB

```bash
docker compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### Step 4 – Check logs

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

---

## 📁 File Reference

| File                      | Purpose                                                  |
| ------------------------- | -------------------------------------------------------- |
| `Dockerfile`              | Multi-stage build (`development` / `production` targets) |
| `docker-compose.dev.yml`  | Dev: Neon Local proxy + app with hot-reload              |
| `docker-compose.prod.yml` | Prod: app-only container                                 |
| `.env.development`        | Dev env vars (Neon Local credentials) — **never commit** |
| `.env.production`         | Prod env template — **never commit with real secrets**   |
| `.env.example`            | Template for all variables (safe to commit)              |

---

## 🔒 Security Notes

- Both `.env.development` and `.env.production` are listed in `.gitignore`.
- The production image uses `npm ci --omit=dev` — no dev tools included.
- `sslmode=disable` is used only for the local proxy (no TLS between containers). Production always uses `sslmode=require`.
