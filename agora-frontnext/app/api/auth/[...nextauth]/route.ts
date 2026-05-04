import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user.email;
      return email?.endsWith('@aluno.ufsj.edu.br') ?? false;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${user.email}`);
          const data = await res.json();
          token.eh_perfil_completo = data.eh_perfil_completo;
        } catch (e) {
          token.eh_perfil_completo = false;
        }
      }

      if (trigger === "update" && session?.eh_perfil_completo) {
        token.eh_perfil_completo = session.eh_perfil_completo;
      }

      return token;
    },
    async session({ session, token }) {
      (session as any).user.eh_perfil_completo = token.eh_perfil_completo;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  }
})

export { handler as GET, handler as POST }