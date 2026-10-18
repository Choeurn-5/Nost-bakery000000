import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "nost-bakery-jwt-super-secret-key-32charsmin!",
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        // 1. Authenticate via backend API (Laravel Sanctum)
        const rawApiBase = (process.env.NEXT_PUBLIC_API_URL || "https://manage.nostbakery.com/laravel/public").replace(/\/+$/, "");
        const apiBase = rawApiBase.endsWith("/api") ? rawApiBase.slice(0, -4) : rawApiBase;
        try {
          const apiRes = await fetch(`${apiBase}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (apiRes.ok) {
            const json = await apiRes.json();
            if (json.success && json.data?.user) {
              return {
                id: String(json.data.user.id),
                email: json.data.user.email,
                name: json.data.user.name,
                role: json.data.user.role as Role,
              };
            }
          }
        } catch {
          // Backend API unreachable, fall back to local prisma
        }

        // 2. Fallback to direct database check
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.active) {
            return null;
          }

          const isValid = await bcrypt.compare(password, user.hashedPassword);
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
});
