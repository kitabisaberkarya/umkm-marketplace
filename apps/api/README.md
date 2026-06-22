# UMKMku API — NestJS Backend

Backend REST API untuk platform marketplace UMKMku.

## Tech Stack

- **NestJS 11** + TypeScript
- **Prisma 6** (ORM) + PostgreSQL
- **Redis** + BullMQ (queue)
- **JWT** (access + refresh token) + Argon2
- **Swagger/OpenAPI** — docs di `/api/docs`

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Buat file .env
cp .env.example .env
# Edit .env — isi DATABASE_URL, JWT secrets, dll

# 3. Pastikan PostgreSQL & Redis berjalan
# (dari root monorepo: docker-compose up -d)

# 4. Buat tabel database
pnpm prisma:migrate

# 5. Isi data demo (opsional)
pnpm prisma:seed

# 6. Jalankan server
pnpm dev
```

Server: http://localhost:3001/api  
Swagger: http://localhost:3001/api/docs

## Struktur Modul

```
src/
├── common/
│   ├── decorators/    → @CurrentUser, @Roles, @Public
│   ├── filters/       → Global exception filter
│   ├── guards/        → JwtAuthGuard, RolesGuard
│   ├── interceptors/  → ResponseInterceptor, LoggingInterceptor
│   └── dto/           → PaginationDto, paginate()
├── config/            → app.config.ts, jwt.config.ts
├── prisma/            → PrismaService, PrismaModule
└── modules/
    ├── auth/          → register, login, refresh, logout
    ├── users/         → CRUD user, profil saya
    ├── seller-profiles/ → pendaftaran toko, verifikasi
    ├── categories/    → CRUD kategori (admin)
    └── products/      → CRUD produk, filter, search
```

## Akun Demo (setelah seed)

| Role   | Email                | Password    |
|--------|----------------------|-------------|
| Admin  | admin@umkmku.id      | Admin123!   |
| Buyer  | budi@test.com        | Buyer123!   |
| Seller | siti@test.com        | Seller123!  |

## Testing

```bash
pnpm test           # Unit test
pnpm test:cov       # Coverage
pnpm test:e2e       # E2E test
```
