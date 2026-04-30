import { z } from "zod";
import {
    HousingType,
    WasteManagementStatus,
    WasteType,
} from "@prisma/client";

export const energyRecordSchema = z.object({
    monthlyKwh: z.coerce
        .number()
        .positive("Monthly kWh harus lebih dari 0.")
        .max(100000, "Monthly kWh terlalu besar."),

    electricityCost: z.coerce
        .number()
        .min(0, "Biaya listrik tidak boleh negatif.")
        .max(100000000, "Biaya listrik terlalu besar."),

    housingType: z.nativeEnum(HousingType, {
        message: "Pilih tipe tempat tinggal yang valid.",
    }),

    occupants: z.coerce
        .number()
        .int("Jumlah penghuni harus bilangan bulat.")
        .positive("Jumlah penghuni minimal 1.")
        .max(1000, "Jumlah penghuni terlalu besar."),

    dominantDevices: z
        .string()
        .min(2, "Isi perangkat dominan minimal 2 karakter.")
        .max(200, "Perangkat dominan terlalu panjang."),

    notes: z.string().max(500, "Catatan maksimal 500 karakter.").optional(),

    recordDate: z.string().optional(),
});

export const wasteRecordSchema = z.object({
    wasteType: z.nativeEnum(WasteType, {
        message: "Pilih jenis limbah yang valid.",
    }),

    weightKg: z.coerce
        .number()
        .positive("Berat limbah harus lebih dari 0.")
        .max(100000, "Berat limbah terlalu besar."),

    wasteSource: z
        .string()
        .min(2, "Sumber limbah minimal 2 karakter.")
        .max(200, "Sumber limbah terlalu panjang."),

    managementStatus: z.nativeEnum(WasteManagementStatus, {
        message: "Pilih status pengelolaan yang valid.",
    }),

    notes: z.string().max(500, "Catatan maksimal 500 karakter.").optional(),

    recordDate: z.string().optional(),
});

export type EnergyRecordInput = z.infer<typeof energyRecordSchema>;
export type WasteRecordInput = z.infer<typeof wasteRecordSchema>;