import { z } from "zod";

export const updateUserRoleSchema = z.object({
    role: z.enum(["USER", "COMMUNITY_LEADER", "ADMIN"], {
        message: "Role tidak valid.",
    }),
});

export const createCitySchema = z.object({
    name: z
        .string()
        .min(2, "Nama kota minimal 2 karakter.")
        .max(80, "Nama kota terlalu panjang."),
    province: z
        .string()
        .min(2, "Nama provinsi minimal 2 karakter.")
        .max(80, "Nama provinsi terlalu panjang."),
    country: z
        .string()
        .min(2, "Nama negara minimal 2 karakter.")
        .max(80, "Nama negara terlalu panjang.")
        .default("Indonesia"),
});

export const createActionSchema = z.object({
    name: z
        .string()
        .min(3, "Nama aksi minimal 3 karakter.")
        .max(120, "Nama aksi terlalu panjang."),
    description: z
        .string()
        .min(10, "Deskripsi minimal 10 karakter.")
        .max(800, "Deskripsi terlalu panjang."),
    category: z.enum(["ENERGY", "WASTE", "CIRCULAR", "COMMUNITY", "GENERAL"], {
        message: "Kategori aksi tidak valid.",
    }),
    difficultyLevel: z.enum(["EASY", "MEDIUM", "HARD"], {
        message: "Tingkat kesulitan tidak valid.",
    }),
    baseImpactScore: z.coerce
        .number()
        .min(1, "Base score minimal 1.")
        .max(500, "Base score terlalu besar."),
});

export const createChallengeSchema = z
    .object({
        name: z
            .string()
            .min(3, "Nama challenge minimal 3 karakter.")
            .max(140, "Nama challenge terlalu panjang."),
        description: z
            .string()
            .min(10, "Deskripsi minimal 10 karakter.")
            .max(900, "Deskripsi terlalu panjang."),
        type: z.enum(["ENERGY", "WASTE", "CIRCULAR", "CROSS_CITY", "COMMUNITY"], {
            message: "Tipe challenge tidak valid.",
        }),
        targetValue: z.coerce
            .number()
            .min(1, "Target minimal 1.")
            .max(1000000, "Target terlalu besar."),
        startDate: z.coerce.date({
            message: "Tanggal mulai tidak valid.",
        }),
        endDate: z.coerce.date({
            message: "Tanggal selesai tidak valid.",
        }),
    })
    .refine((data) => data.endDate >= data.startDate, {
        message: "Tanggal selesai harus setelah atau sama dengan tanggal mulai.",
        path: ["endDate"],
    });

export const createBadgeSchema = z.object({
    name: z
        .string()
        .min(3, "Nama badge minimal 3 karakter.")
        .max(120, "Nama badge terlalu panjang."),
    description: z
        .string()
        .min(10, "Deskripsi minimal 10 karakter.")
        .max(700, "Deskripsi terlalu panjang."),
    category: z.enum(
        ["ENERGY", "WASTE", "CIRCULAR", "IMPACT", "COMMUNITY", "STREAK"],
        {
            message: "Kategori badge tidak valid.",
        }
    ),
    requiredScore: z.coerce
        .number()
        .min(0, "Required score minimal 0.")
        .max(1000000, "Required score terlalu besar."),
});

export const createCommunitySchema = z.object({
    name: z
        .string()
        .min(3, "Nama komunitas minimal 3 karakter.")
        .max(120, "Nama komunitas terlalu panjang."),
    type: z.enum(
        [
            "CAMPUS",
            "CITY",
            "UMKM",
            "YOUTH_ORGANIZATION",
            "ENVIRONMENTAL_COMMUNITY",
            "OTHER",
        ],
        {
            message: "Tipe komunitas tidak valid.",
        }
    ),
    cityId: z.string().min(1, "City node wajib dipilih."),
});

export const createCommunityMemberSchema = z.object({
    communityId: z.string().min(1, "Community wajib dipilih."),
    userId: z.string().min(1, "User wajib dipilih."),
    memberRole: z
        .string()
        .min(2, "Role member minimal 2 karakter.")
        .max(80, "Role member terlalu panjang.")
        .default("Member"),
});

export type CreateCommunityMemberInput = z.infer<
    typeof createCommunityMemberSchema
>
export const updateCommunitySchema = createCommunitySchema;
export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;
export const updateBadgeSchema = createBadgeSchema;
export type CreateBadgeInput = z.infer<typeof createBadgeSchema>;
export type UpdateBadgeInput = z.infer<typeof updateBadgeSchema>;
export const updateChallengeSchema = createChallengeSchema;
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
export type UpdateChallengeInput = z.infer<typeof updateChallengeSchema>;
export const updateActionSchema = createActionSchema;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type CreateCityInput = z.infer<typeof createCitySchema>;
export type CreateActionInput = z.infer<typeof createActionSchema>;
export type UpdateActionInput = z.infer<typeof updateActionSchema>;