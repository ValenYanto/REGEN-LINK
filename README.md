# REGEN-LINK

AI-powered collaborative climate action platform for energy efficiency and circular waste action.

REGEN-LINK adalah platform climate action lintas kota berbasis AI/rule-based intelligence untuk membantu user mencatat data energi dan limbah, mendapatkan rekomendasi aksi, menghitung estimasi dampak, membuka badge, mengikuti challenge, melihat leaderboard, dan memantau city insights.

Project ini dibangun sebagai aplikasi Next.js full-stack dengan dashboard user, admin control center, PostgreSQL database, Prisma ORM, Auth.js credentials authentication, dan dokumentasi API berbasis OpenAPI/Scalar.

## Demo Accounts

Demo accounts hanya tersedia jika menjalankan demo scenario seed:

```bash
npm run db:seed:demo
```

Akun demo:

| Scenario | Email |
| --- | --- |
| Mahasiswa Anak Kos | `mahasiswa.kos@regenlink.demo` |
| Komunitas Kampus | `komunitas.kampus@regenlink.demo` |
| UMKM Makanan | `umkm.makanan@regenlink.demo` |

Password demo memakai env `DEMO_PASSWORD`. Jika env tidak di-set, fallback di `prisma/seed-demo-scenarios.ts` adalah `demo12345`.

Demo accounts hanya untuk local development, staging, atau presentasi. Jangan gunakan demo seed untuk production.

Admin account dibuat oleh production/master seed dari env:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Jangan hardcode password production di README, source code, atau file yang di-commit.

## Key Features

### Public Landing Page

- Modern landing page di `/`
- CTA login/register
- Platform explanation
- Feature highlights
- Impact preview
- Cross-city intelligence preview
- Admin-ready platform preview
- API docs link dapat diarahkan ke `/api-docs`

### Authentication

- Register user baru
- Login dan logout
- Auth.js / NextAuth Credentials Provider
- bcrypt password hash
- JWT session strategy
- Role-based access untuk `USER`, `COMMUNITY_LEADER`, dan `ADMIN`
- Dashboard redirect protection untuk user yang belum login
- Admin route protection melalui `src/lib/auth/admin.ts`

### User Dashboard

- Overview dashboard
- Energy Records
- Waste Records
- Impact Center
- AI Recommendations
- Actions Center
- Challenges
- Leaderboard
- City Insights
- Profile

### Admin Dashboard

- Admin Overview
- Users & Roles
- Action Master
- Challenges
- Badges
- Cities
- Communities
- Community member management
- Safety check delete untuk master data yang sudah dipakai
- Safety check agar admin terakhir tidak tidak sengaja menurunkan role sendiri

### API Documentation

Project ini memiliki dokumentasi API:

- `/api-docs` untuk interactive documentation dengan Scalar API Reference
- `/openapi.json` untuk raw OpenAPI spec
- `src/lib/openapi.ts` sebagai source manual OpenAPI document

## Tech Stack

| Category | Technology |
| --- | --- |
| Frontend | Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui |
| Auth | Auth.js / NextAuth, Credentials Provider, bcryptjs |
| Database | PostgreSQL, Prisma ORM |
| Validation | Zod |
| UI/UX | Framer Motion, lucide-react, Recharts, next-themes |
| API Docs | OpenAPI, Scalar API Reference |
| Deployment | Vercel |

## Project Structure

Struktur ringkas berdasarkan folder project saat ini:

```txt
.
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   ├── seed.ts
│   └── seed-demo-scenarios.ts
├── public/
│   ├── logo.png
│   └── *.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── challenges/
│   │   │   ├── cities/
│   │   │   ├── energy-records/
│   │   │   ├── impact/
│   │   │   ├── user-actions/
│   │   │   └── waste-records/
│   │   ├── api-docs/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── actions/
│   │   │   ├── challenges/
│   │   │   ├── city-insights/
│   │   │   ├── energy/
│   │   │   ├── impact/
│   │   │   ├── leaderboard/
│   │   │   ├── profile/
│   │   │   ├── recommendations/
│   │   │   └── waste/
│   │   ├── login/
│   │   ├── openapi.json/
│   │   ├── register/
│   │   └── page.tsx
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── providers/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   │   ├── auth/
│   │   ├── impact/
│   │   ├── openapi.ts
│   │   ├── prisma.ts
│   │   ├── utils.ts
│   │   └── valdiations/
│   ├── types/
│   └── auth.ts
├── .env.example
├── package.json
├── prisma.config.ts
└── README.md
```

Catatan: folder `src/lib/valdiations/` memang masih typo di project saat ini. Jangan rename folder ini tanpa refactor semua import terkait.

## Environment Variables

Copy `.env.example` menjadi `.env`, lalu sesuaikan nilainya.

```env
DATABASE_URL=""
AUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

ADMIN_NAME="Admin REGEN-LINK"
ADMIN_EMAIL="admin@regenlink.id"
ADMIN_PASSWORD="change-this-password"
ADMIN_CITY_NAME="Bogor"
ADMIN_CITY_PROVINCE="Jawa Barat"

DEMO_PASSWORD="demo12345"
```

Penjelasan:

- `DATABASE_URL` wajib. Gunakan PostgreSQL connection string.
- `AUTH_SECRET` wajib untuk Auth.js session security.
- `NEXTAUTH_URL` gunakan `http://localhost:3000` saat local dan domain production saat deploy.
- `NEXT_PUBLIC_APP_URL` dipakai oleh OpenAPI server URL di `src/lib/openapi.ts`.
- `ADMIN_*` dipakai oleh `prisma/seed.ts` untuk membuat atau memperbarui admin.
- `DEMO_PASSWORD` opsional dan hanya dipakai oleh `prisma/seed-demo-scenarios.ts`.

Jika memakai Auth.js v5, `AUTH_SECRET` dan `AUTH_URL` juga umum digunakan. `.env.example` saat ini menyertakan kompatibilitas `AUTH_URL`, `NEXTAUTH_SECRET`, dan `NEXTAUTH_URL`.

## Installation

```bash
git clone <repo-url>
cd regen-link
npm install
cp .env.example .env
```

Edit `.env`, lalu jalankan:

```bash
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Buka:

```txt
http://localhost:3000
```

## Database & Seed

### Production/Master Seed

File:

```txt
prisma/seed.ts
```

Seed ini membuat atau memperbarui:

- Cities: Bogor, Bandung, Yogyakarta, Jakarta, Surabaya
- Communities minimal
- Action master
- Badges
- Challenges
- Admin user dari env `ADMIN_EMAIL` dan `ADMIN_PASSWORD`
- Regenerative score awal untuk admin

Command:

```bash
npm run db:seed
```

Atau:

```bash
npx prisma db seed
```

Production/master seed tidak membuat demo user.

### Demo Scenario Seed

File:

```txt
prisma/seed-demo-scenarios.ts
```

Command:

```bash
npm run db:seed:demo
```

Seed demo membuat data presentasi untuk:

- Mahasiswa Anak Kos
- Komunitas Kampus
- UMKM Makanan

Demo scenario seed juga membuat master data yang dibutuhkan jika belum ada, lalu mengisi energy records, waste records, recommendations, completed actions, impact estimations, badges, scores, challenge progress, dan community membership untuk skenario demo.

Gunakan demo seed hanya untuk local development, staging, atau presentasi. Jangan jalankan demo seed di production.

## Available Scripts

Scripts yang tersedia di `package.json`:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run db:generate
npm run db:push
npm run db:seed
npm run db:seed:demo
```

Detail:

| Script | Description |
| --- | --- |
| `npm run dev` | Menjalankan Next.js development server |
| `npm run build` | Menjalankan `prisma generate` lalu `next build` |
| `npm run start` | Menjalankan production server setelah build |
| `npm run lint` | Menjalankan ESLint |
| `npm run typecheck` | Menjalankan TypeScript check tanpa emit |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema Prisma ke database |
| `npm run db:seed` | Menjalankan production/master seed |
| `npm run db:seed:demo` | Menjalankan demo scenario seed |

Build command sengaja tidak menjalankan seed.

## API Documentation

Jalankan app secara local:

```bash
npm run dev
```

Akses dokumentasi:

```txt
http://localhost:3000/api-docs
```

Akses raw OpenAPI spec:

```txt
http://localhost:3000/openapi.json
```

Source spec:

```txt
src/lib/openapi.ts
```

OpenAPI document saat ini mencakup endpoint auth/register, energy records, waste records, impact generation, user actions, challenges, dan beberapa admin master data.

## Deployment to Vercel

1. Push repo ke GitHub.
2. Import project ke Vercel.
3. Set environment variables production di Vercel:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_APP_URL`
   - `ADMIN_NAME`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_CITY_NAME`
   - `ADMIN_CITY_PROVINCE`
4. Set build command:

```bash
npm run build
```

5. Setelah database production siap, jalankan setup database dari local machine dengan `DATABASE_URL` production:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Jangan seed otomatis di Vercel build. Jalankan production/master seed secara manual dan terkontrol.

## Production Checklist

- [ ] `npm run build` sukses
- [ ] `npm run typecheck` sukses
- [ ] `.env` tidak commit
- [ ] `DATABASE_URL` production benar
- [ ] `AUTH_SECRET` production di-set
- [ ] `NEXTAUTH_URL` production benar
- [ ] `NEXT_PUBLIC_APP_URL` production benar
- [ ] Admin seed berhasil
- [ ] Login admin berhasil
- [ ] Register user baru berhasil
- [ ] User biasa tidak melihat admin
- [ ] API docs bisa dibuka
- [ ] Mobile responsive aman
- [ ] Dark/light mode aman

## Manual Testing Flow

1. Register user baru.
2. Login.
3. Isi Energy Records.
4. Isi Waste Records.
5. Generate Impact.
6. Buka Recommendations.
7. Complete Action.
8. Join Challenge.
9. Cek Leaderboard.
10. Cek City Insights.
11. Login Admin.
12. Test CRUD master data.
13. Test safety delete untuk master data yang sudah dipakai.
14. Test update role user.

## Notes / Known Decisions

- Folder `src/lib/valdiations/` masih typo dan dibiarkan sesuai struktur project saat ini. Jangan rename tanpa refactor import.
- Seed production tidak membuat demo user.
- Demo scenario seed terpisah dari production/master seed.
- Admin dibuat dari environment variables.
- Password tidak boleh di-commit.
- API docs memakai manual OpenAPI document dan bisa diperluas seiring penambahan endpoint.
- `npm run build` menjalankan `prisma generate && next build` agar Prisma Client tersedia saat Vercel build.
- Seed tidak dijalankan otomatis saat build.

## Final Local Setup Commands

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Optional demo data:

```bash
npm run db:seed:demo
```

## Final Production Setup Commands

Jalankan dengan env production yang benar:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run build
```

Untuk Vercel, build command cukup:

```bash
npm run build
```

## Credits / License

REGEN-LINK dibuat sebagai climate action platform untuk mendukung energy efficiency, circular waste action, dan kolaborasi komunitas lintas kota.

License belum ditentukan. Tambahkan file `LICENSE` sebelum rilis publik jika project akan dibuka untuk kontribusi eksternal.
