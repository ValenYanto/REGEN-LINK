import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Nama minimal 2 karakter.")
        .max(80, "Nama terlalu panjang."),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Format email tidak valid.")
        .max(120, "Email terlalu panjang."),
    password: z
        .string()
        .min(8, "Password minimal 8 karakter.")
        .max(100, "Password terlalu panjang."),
    cityId: z.string().trim().optional(),
});

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email("Format email tidak valid."),
    password: z.string().min(1, "Password wajib diisi."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
