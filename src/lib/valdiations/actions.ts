import { z } from "zod";
import { UserActionStatus } from "@prisma/client";

export const updateUserActionSchema = z.object({
    status: z.nativeEnum(UserActionStatus),
    notes: z.string().max(500, "Catatan maksimal 500 karakter.").optional(),
    proofUrl: z.string().url("Proof URL harus valid.").optional().or(z.literal("")),
});

export type UpdateUserActionInput = z.infer<typeof updateUserActionSchema>;