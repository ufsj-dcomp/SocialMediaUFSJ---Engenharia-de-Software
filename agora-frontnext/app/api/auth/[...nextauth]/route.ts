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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${user.email}`);
          const data = await res.json();

          token.eh_perfil_completo = data.eh_perfil_completo;
          token.eh_administrador_geral = data.eh_administrador_geral;
          token.eh_administrador_curso = data.eh_administrador_curso;
          token.foto = data.foto;
          
          if (!data.eh_administrador_geral && !data.eh_administrador_curso) {
              token.role_selecionado = 'ESTUDANTE';
          } else {
              token.role_selecionado = null; 
          }
        } catch (e) {
          token.eh_perfil_completo = false;
        }
      }

      if (trigger === "update" && session) {
        if (session.eh_perfil_completo !== undefined) token.eh_perfil_completo = session.eh_perfil_completo;
        if (session.role_selecionado !== undefined) token.role_selecionado = session.role_selecionado;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.eh_perfil_completo = token.eh_perfil_completo;
        session.user.eh_administrador_geral = token.eh_administrador_geral;
        session.user.eh_administrador_curso = token.eh_administrador_curso;
        session.user.role_selecionado = token.role_selecionado;
        session.user.foto = token.foto;
      }
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