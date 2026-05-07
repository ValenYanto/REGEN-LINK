export const openApiDocument = {
    openapi: "3.1.0",
    info: {
        title: "REGEN-LINK API",
        version: "1.0.0",
        description:
            "API documentation for REGEN-LINK, a collaborative climate action platform for energy efficiency, circular waste action, AI recommendations, impact tracking, regenerative score, challenges, leaderboard, city insights, and admin control.",
    },
    servers: [
        {
            url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
            description: "REGEN-LINK Application Server",
        },
    ],
    tags: [
        { name: "Auth", description: "Authentication and registration" },
        { name: "Energy Records", description: "User energy input records" },
        { name: "Waste Records", description: "User waste input records" },
        { name: "Impact", description: "Recommendation and impact generation" },
        { name: "User Actions", description: "User action status management" },
        { name: "Challenges", description: "Challenge participation" },
        { name: "Admin", description: "Admin master data management" },
    ],
    paths: {
        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                description:
                    "Creates a new user account with hashed password and default USER role.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RegisterRequest",
                            },
                            example: {
                                name: "Regen-Link",
                                email: "user@regenlink.id",
                                password: "passwordkuat123",
                                confirmPassword: "passwordkuat123",
                                cityId: "city_id_optional",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Registration successful",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/AuthSuccessResponse",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Invalid request body",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "409": {
                        description: "Email already registered",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/api/energy-records": {
            post: {
                tags: ["Energy Records"],
                summary: "Create energy record",
                description:
                    "Creates a monthly electricity consumption record for the authenticated user.",
                security: [{ sessionAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CreateEnergyRecordRequest",
                            },
                            example: {
                                monthlyKwh: 178,
                                electricityCost: 264000,
                                housingType: "KOS",
                                occupants: 1,
                                dominantDevices:
                                    "Laptop, charger HP, kipas angin, lampu LED",
                                notes: "Mulai mematikan perangkat standby.",
                                recordDate: "2026-05-07",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Energy record created",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/SuccessResponse",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/api/waste-records": {
            post: {
                tags: ["Waste Records"],
                summary: "Create waste record",
                description:
                    "Creates a waste tracking record for the authenticated user.",
                security: [{ sessionAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CreateWasteRecordRequest",
                            },
                            example: {
                                wasteType: "PLASTIC",
                                weightKg: 2.8,
                                wasteSource: "Kemasan makanan dan minuman",
                                managementStatus: "SENT_TO_WASTE_BANK",
                                notes: "Dikirim ke bank sampah.",
                                recordDate: "2026-05-07",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Waste record created",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/SuccessResponse",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/api/impact/generate": {
            post: {
                tags: ["Impact"],
                summary: "Generate recommendations and impact estimations",
                description:
                    "Reads the latest energy and waste records, generates AI/rule-based recommendations, creates user actions, and stores impact estimations.",
                security: [{ sessionAuth: [] }],
                responses: {
                    "200": {
                        description: "Impact generation completed or skipped",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ImpactGenerateResponse",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/api/user-actions/{id}": {
            patch: {
                tags: ["User Actions"],
                summary: "Update user action status",
                description:
                    "Updates a user action status, such as starting an action or marking it as completed.",
                security: [{ sessionAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                        description: "UserAction ID",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UpdateUserActionRequest",
                            },
                            example: {
                                status: "COMPLETED",
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "User action updated",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/SuccessResponse",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "User action not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/api/challenges/{id}/join": {
            post: {
                tags: ["Challenges"],
                summary: "Join challenge",
                description:
                    "Allows the authenticated user to join a challenge.",
                security: [{ sessionAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string",
                        },
                        description: "Challenge ID",
                    },
                ],
                responses: {
                    "200": {
                        description: "Challenge joined",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/SuccessResponse",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Unauthorized",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Challenge not found",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/api/admin/actions": {
            post: {
                tags: ["Admin"],
                summary: "Create action master",
                description:
                    "Admin-only endpoint to create a new action template.",
                security: [{ sessionAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CreateActionRequest",
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Action master created",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/SuccessResponse",
                                },
                            },
                        },
                    },
                    "403": {
                        description: "Forbidden, admin only",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },

        "/api/admin/actions/{id}": {
            patch: {
                tags: ["Admin"],
                summary: "Update action master",
                security: [{ sessionAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/CreateActionRequest",
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Action updated",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/SuccessResponse",
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["Admin"],
                summary: "Delete action master",
                description:
                    "Deletes an action master only if it is not used by user actions or AI recommendations.",
                security: [{ sessionAuth: [] }],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": {
                        description: "Action deleted",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/SuccessResponse",
                                },
                            },
                        },
                    },
                    "409": {
                        description: "Action is already used",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
    },

    components: {
        securitySchemes: {
            sessionAuth: {
                type: "apiKey",
                in: "cookie",
                name: "authjs.session-token",
                description:
                    "NextAuth/Auth.js session cookie. In production, this may be stored as a secure cookie.",
            },
        },
        schemas: {
            RegisterRequest: {
                type: "object",
                required: ["name", "email", "password", "confirmPassword"],
                properties: {
                    name: { type: "string", example: "Valen Yanto" },
                    email: {
                        type: "string",
                        format: "email",
                        example: "valen@example.com",
                    },
                    password: {
                        type: "string",
                        format: "password",
                        minLength: 8,
                    },
                    confirmPassword: {
                        type: "string",
                        format: "password",
                        minLength: 8,
                    },
                    cityId: {
                        type: "string",
                        nullable: true,
                        description: "Optional city ID.",
                    },
                },
            },

            CreateEnergyRecordRequest: {
                type: "object",
                required: [
                    "monthlyKwh",
                    "electricityCost",
                    "housingType",
                    "occupants",
                    "dominantDevices",
                    "recordDate",
                ],
                properties: {
                    monthlyKwh: { type: "number", example: 178 },
                    electricityCost: { type: "number", example: 264000 },
                    housingType: {
                        type: "string",
                        enum: ["KOS", "DORMITORY", "HOUSE", "APARTMENT", "UMKM"],
                    },
                    occupants: { type: "integer", example: 1 },
                    dominantDevices: {
                        type: "string",
                        example: "Laptop, charger HP, kipas angin",
                    },
                    notes: {
                        type: "string",
                        nullable: true,
                    },
                    recordDate: {
                        type: "string",
                        format: "date",
                    },
                },
            },

            CreateWasteRecordRequest: {
                type: "object",
                required: [
                    "wasteType",
                    "weightKg",
                    "wasteSource",
                    "managementStatus",
                    "recordDate",
                ],
                properties: {
                    wasteType: {
                        type: "string",
                        enum: ["FOOD", "PLASTIC", "PAPER", "ORGANIC", "MIXED"],
                    },
                    weightKg: { type: "number", example: 2.8 },
                    wasteSource: {
                        type: "string",
                        example: "Kemasan makanan dan minuman",
                    },
                    managementStatus: {
                        type: "string",
                        enum: [
                            "NOT_SORTED",
                            "SORTED",
                            "RECYCLED",
                            "COMPOSTED",
                            "SENT_TO_WASTE_BANK",
                        ],
                    },
                    notes: {
                        type: "string",
                        nullable: true,
                    },
                    recordDate: {
                        type: "string",
                        format: "date",
                    },
                },
            },

            UpdateUserActionRequest: {
                type: "object",
                required: ["status"],
                properties: {
                    status: {
                        type: "string",
                        enum: [
                            "PLANNED",
                            "IN_PROGRESS",
                            "COMPLETED",
                            "VERIFIED",
                            "CANCELLED",
                        ],
                    },
                },
            },

            CreateActionRequest: {
                type: "object",
                required: [
                    "name",
                    "category",
                    "difficultyLevel",
                    "description",
                    "baseImpactScore",
                ],
                properties: {
                    name: {
                        type: "string",
                        example: "Reduce Standby Power",
                    },
                    category: {
                        type: "string",
                        enum: ["ENERGY", "WASTE", "CIRCULAR", "COMMUNITY", "GENERAL"],
                    },
                    difficultyLevel: {
                        type: "string",
                        enum: ["EASY", "MEDIUM", "HARD"],
                    },
                    description: {
                        type: "string",
                    },
                    baseImpactScore: {
                        type: "integer",
                        example: 12,
                    },
                },
            },

            ImpactGenerateResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Recommendations generated successfully.",
                    },
                    skipped: {
                        type: "boolean",
                        example: false,
                    },
                },
            },

            AuthSuccessResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Registrasi berhasil.",
                    },
                    user: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            email: { type: "string", format: "email" },
                        },
                    },
                },
            },

            SuccessResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Success.",
                    },
                },
            },

            ErrorResponse: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Terjadi kesalahan pada server.",
                    },
                },
            },
        },
    },
} as const;