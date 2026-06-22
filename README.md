# UMKMku — Marketplace UMKM Indonesia

Platform marketplace untuk seluruh produk UMKM Indonesia. Gratis untuk penjual, monetisasi melalui iklan dan produk sponsored.

## Arsitektur

```
umkm-marketplace/
├── apps/
│   ├── api/        → Backend NestJS (TypeScript)
│   ├── web/        → Frontend Next.js 14 (buyer + seller dashboard)
│   ├── admin/      → Panel admin (Next.js)
│   └── mobile/     → Aplikasi Flutter (Android + iOS)
├── packages/
│   ├── shared-types/ → Tipe TypeScript bersama (api ↔ web)
│   └── ui/           → Komponen UI bersama (opsional)
├── docker-compose.yml
└── .env.example
```

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Backend API | NestJS + TypeScript |
| Web Frontend | Next.js 14 (App Router) + TypeScript |
| Mobile | Flutter (Dart) |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| Cache & Queue | Redis 7 + BullMQ |
| Auth | JWT (access + refresh) + Argon2 |
| Storage | MinIO (dev) / S3 / Cloudflare R2 (prod) |
| Payment | Midtrans / Xendit (sandbox) |
| Shipping | Biteship (sandbox) |

## Prasyarat

- Node.js >= 20
- pnpm >= 9
- Docker + Docker Compose
- Flutter SDK >= 3.x (untuk mobile)

## Setup Awal

### 1. Clone & Install dependencies

```bash
git clone <repo-url>
cd umkm-marketplace
pnpm install
```

### 2. Konfigurasi environment

```bash
cp .env.example .env
# Edit .env dan isi semua nilai yang diperlukan
```

### 3. Jalankan infrastruktur (PostgreSQL, Redis, MinIO)

```bash
docker-compose up -d
```

Verifikasi container berjalan:
```bash
docker-compose ps
```

### 4. Jalankan migrasi database

```bash
pnpm db:migrate
```

### 5. Jalankan semua service (development)

```bash
pnpm dev
```

Atau jalankan per service:
```bash
# Backend API
pnpm --filter api dev     → http://localhost:3001
pnpm --filter api dev     # Swagger: http://localhost:3001/api/docs

# Web
pnpm --filter web dev     → http://localhost:3000

# Admin
pnpm --filter admin dev   → http://localhost:3002
```

## Rencana Pengembangan

| Fase | Scope | Status |
|------|-------|--------|
| FASE 0 | Monorepo, docker-compose, linting | ✅ Selesai |
| FASE 1 | Backend inti: Auth, Users, Products, Swagger | 🔄 In Progress |
| FASE 2 | Transaksi: Cart, Orders, Payments, Shipments | ⏳ Pending |
| FASE 3 | Web frontend buyer (Next.js) | ⏳ Pending |
| FASE 4 | Dashboard seller & admin (web) | ⏳ Pending |
| FASE 5 | Mobile Flutter (buyer) | ⏳ Pending |
| FASE 6 | Hardening, CI/CD, optimasi | ⏳ Pending |

## Konvensi Kode

- **Bahasa**: TypeScript untuk backend + web, Dart untuk mobile
- **Linting**: ESLint + Prettier (TS), `dart analyze` + `dart format` (Flutter)
- **Branching**: `main` (prod) → `develop` → `feature/*`, `fix/*`
- **Commit**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)
- **Test**: Jest (unit + e2e) untuk backend, Widget Test untuk Flutter

## Kontribusi

1. Buat branch dari `develop`: `git checkout -b feature/nama-fitur`
2. Pastikan lint & test lulus: `pnpm lint && pnpm test`
3. Buat PR ke `develop`

## Lisensi

Proprietary — © 2026 UMKMku
