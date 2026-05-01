# REGEN-LINK

**REGEN-LINK** adalah platform collaborative climate action lintas kota berbasis AI untuk membantu pengguna mencatat konsumsi energi, mencatat limbah, mendapatkan rekomendasi aksi, menghitung estimasi dampak, meningkatkan regenerative score, membuka badge, mengikuti challenge, dan memantau kontribusi lintas kota.

Project ini dibuat sebagai MVP untuk konteks hackathon/kampus dengan fokus pada **energy efficiency**, **circular waste action**, dan **regenerative living**.

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Database Setup](#database-setup)
- [Seed Data](#seed-data)
- [Authentication](#authentication)
- [Admin Dashboard](#admin-dashboard)
- [Production Deployment](#production-deployment)
- [Vercel Deployment Checklist](#vercel-deployment-checklist)
- [Testing Checklist](#testing-checklist)
- [Useful Commands](#useful-commands)
- [Notes](#notes)

---

## Overview

REGEN-LINK mengubah data sederhana seperti konsumsi listrik bulanan dan catatan limbah menjadi aksi iklim yang lebih terukur.

Platform ini dirancang untuk:

- Mahasiswa
- Anak kos
- Komunitas kampus
- Komunitas lingkungan
- UMKM
- Rumah tangga urban
- Stakeholder kota atau komunitas

REGEN-LINK tidak hanya menjadi aplikasi pencatatan, tetapi juga menggabungkan:

- Input data energi
- Input data limbah
- Rekomendasi aksi berbasis AI/rule-based logic
- Estimasi dampak lingkungan
- Regenerative score
- Badge dan gamification
- Challenge lintas kota
- Leaderboard
- City insights
- Admin control center

---

## Core Features

### 1. Landing Page

Landing page modern untuk memperkenalkan REGEN-LINK sebagai climate-tech platform.

Isi landing page:

- Hero section
- Platform explanation
- Feature highlights
- Impact preview
- How it works
- Cross-city intelligence
- Admin-ready platform
- CTA login/register

---

### 2. Authentication

REGEN-LINK menggunakan authentication berbasis:

- NextAuth Credentials
- bcryptjs
- Prisma
- PostgreSQL

Fitur auth:

- Register user baru
- Login user
- Logout
- Session JWT
- Role-based access
- Admin-only protection

Role user:

- `USER`
- `COMMUNITY_LEADER`
- `ADMIN`

Session menyimpan data penting:

- `id`
- `role`
- `cityId`
- `cityName`

---

### 3. Dashboard Overview

Dashboard utama menampilkan ringkasan aktivitas user:

- Energy records
- Waste records
- Actions
- Badges
- Impact cards
- Charts
- Latest recommendations
- Latest records
- Active challenges
- Next best action

---

### 4. Energy Input Center

User dapat mencatat data konsumsi listrik:

- Monthly kWh
- Electricity cost
- Housing type
- Occupants
- Dominant devices
- Notes
- Record date

Data ini digunakan untuk analisis rekomendasi dan estimasi dampak.

---

### 5. Waste Input Center

User dapat mencatat data limbah:

- Waste type
- Weight
- Waste source
- Management status
- Notes
- Record date

Data limbah digunakan untuk rekomendasi circular action dan waste reduction.

---

### 6. Impact Center

Impact Center membaca data energi dan limbah terbaru untuk menghasilkan:

- AI recommendations
- User actions
- Impact estimations
- Energy saved
- Waste reduced
- CO₂ avoided
- Cost saved

---

### 7. AI Recommendations

Halaman rekomendasi menampilkan daftar aksi prioritas yang dibuat berdasarkan data user.

Informasi yang ditampilkan:

- Action name
- Category
- Difficulty
- Confidence score
- Recommendation reason
- Related impact estimation
- Action status

---

### 8. Actions Center

User dapat menjalankan aksi yang dibuat dari rekomendasi.

Status action:

- `PLANNED`
- `IN_PROGRESS`
- `COMPLETED`
- `VERIFIED`
- `CANCELLED`

Ketika action selesai, sistem dapat memperbarui:

- Regenerative score
- Badge unlock
- Challenge progress

---

### 9. Challenges

User dapat mengikuti challenge:

- Energy challenge
- Waste challenge
- Circular challenge
- Community challenge
- Cross-city challenge

Progress challenge dihitung dari aksi yang sudah diselesaikan.

---

### 10. Leaderboard

Leaderboard menampilkan ranking user berdasarkan:

1. Total regenerative score
2. Completed actions
3. Badge count

Leaderboard juga menampilkan posisi user saat ini.

---

### 11. City Insights

City Insights menampilkan agregasi kontribusi per kota:

- Total users
- Total score
- Total energy recorded
- Total waste recorded
- Completed actions
- Badge count
- City ranking

---

### 12. Profile

Profile menampilkan identitas dan kontribusi user:

- Name
- Email
- City node
- Role
- Joined date
- Regenerative score
- Current level
- Badges
- Impact summary
- Community membership
- Next steps

---

### 13. Admin Control Center

Admin dapat mengelola data master dan aktivitas platform.

Admin pages:

- Admin Overview
- Users & Roles
- Action Master
- Challenges
- Badges
- Cities
- Communities

Admin features:

- Manage user role
- Create/edit/delete action master
- Create/edit/delete challenges
- Create/edit/delete badges
- Create cities
- Create/edit/delete communities
- Add/remove community members
- Safety check before deleting used data

---

## Tech Stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- Framer Motion
- Recharts
- next-themes

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth Credentials
- bcryptjs
- Zod validation

### Deployment

- Vercel
- PostgreSQL provider such as Neon, Supabase, Railway, or Vercel Postgres

---

## Project Structure

```txt
.
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── public
│   └── logo.png
├── src
│   ├── app
│   │   ├── api
│   │   ├── dashboard
│   │   ├── login
│   │   ├── register
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── admin
│   │   ├── auth
│   │   ├── dashboard
│   │   ├── landing
│   │   ├── motion
│   │   ├── providers
│   │   └── ui
│   ├── lib
│   │   ├── auth
│   │   ├── impact
│   │   ├── prisma.ts
│   │   └── valdiations
│   └── auth.ts
├── .env.example
├── package.json
└── README.md