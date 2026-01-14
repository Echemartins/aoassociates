import type { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/src/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  // Credentials requires JWT sessions
  session: { strategy: "jwt" },

  pages: { signIn: "/admin/login" },

  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim()
        const password = credentials?.password ?? ""

        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.passwordHash || !user.email) return null

        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "Admin",
          role: user.role,
        } as any
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, persist id/role into JWT
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
      }
      return token
    },

    async session({ session, token }) {
      // Expose id/role on session.user
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

// If you are using App Router route handler:
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// If you were importing `authHandler` elsewhere, you can also keep:
export const authHandler = handler
