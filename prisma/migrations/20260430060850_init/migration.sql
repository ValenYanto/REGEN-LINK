-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'COMMUNITY_LEADER', 'ADMIN');

-- CreateEnum
CREATE TYPE "HousingType" AS ENUM ('KOS', 'HOUSE', 'APARTMENT', 'DORMITORY', 'UMKM', 'OTHER');

-- CreateEnum
CREATE TYPE "WasteType" AS ENUM ('FOOD', 'PLASTIC', 'PAPER', 'ORGANIC', 'METAL', 'GLASS', 'MIXED', 'OTHER');

-- CreateEnum
CREATE TYPE "WasteManagementStatus" AS ENUM ('NOT_SORTED', 'SORTED', 'RECYCLED', 'COMPOSTED', 'DONATED', 'SENT_TO_WASTE_BANK', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatarUrl" TEXT,
    "cityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Indonesia',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "monthlyKwh" DOUBLE PRECISION NOT NULL,
    "electricityCost" DOUBLE PRECISION NOT NULL,
    "housingType" "HousingType" NOT NULL,
    "occupants" INTEGER NOT NULL,
    "dominantDevices" TEXT NOT NULL,
    "notes" TEXT,
    "recordDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnergyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wasteType" "WasteType" NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "wasteSource" TEXT NOT NULL,
    "managementStatus" "WasteManagementStatus" NOT NULL,
    "notes" TEXT,
    "recordDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegenerativeScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "level" TEXT NOT NULL DEFAULT 'Seed',
    "cityRank" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegenerativeScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_cityId_idx" ON "User"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_province_key" ON "City"("name", "province");

-- CreateIndex
CREATE INDEX "EnergyRecord_userId_idx" ON "EnergyRecord"("userId");

-- CreateIndex
CREATE INDEX "EnergyRecord_recordDate_idx" ON "EnergyRecord"("recordDate");

-- CreateIndex
CREATE INDEX "WasteRecord_userId_idx" ON "WasteRecord"("userId");

-- CreateIndex
CREATE INDEX "WasteRecord_recordDate_idx" ON "WasteRecord"("recordDate");

-- CreateIndex
CREATE INDEX "WasteRecord_wasteType_idx" ON "WasteRecord"("wasteType");

-- CreateIndex
CREATE UNIQUE INDEX "RegenerativeScore_userId_key" ON "RegenerativeScore"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyRecord" ADD CONSTRAINT "EnergyRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteRecord" ADD CONSTRAINT "WasteRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegenerativeScore" ADD CONSTRAINT "RegenerativeScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
