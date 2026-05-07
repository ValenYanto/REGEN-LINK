import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/valdiations/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
    },

    logger: {
        error(error) {
            const errorName = error.name ?? "";
            const errorMessage = error.message ?? "";

            if (
                errorName === "CredentialsSignin" ||
                errorMessage.includes("CredentialsSignin")
            ) {
                return;
            }

            console.error("[AUTH_ERROR]", error);
        },
    },

    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                try {
                    const parsed = loginSchema.safeParse(credentials);

                    if (!parsed.success) {
                        return null;
                    }

                    const email = parsed.data.email.trim().toLowerCase();
                    const password = parsed.data.password;

                    if (!email || !password) {
                        return null;
                    }

                    const user = await prisma.user.findUnique({
                        where: {
                            email,
                        },
                        include: {
                            city: true,
                        },
                    });

                    if (!user || !user.passwordHash) {
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        password,
                        user.passwordHash
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        cityId: user.cityId,
                        cityName: user.city?.name ?? null,
                    };
                } catch (error) {
                    console.error("[AUTH_AUTHORIZE_ERROR]", error);
                    return null;
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.cityId = user.cityId;
                token.cityName = user.cityName;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.cityId = token.cityId as string | null;
                session.user.cityName = token.cityName as string | null;
            }

            return session;
        },
    },
});