import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      eh_perfil_completo?: boolean;
      eh_administrador_geral?: boolean;
      eh_administrador_curso?: boolean;
      role_selecionado?: string | null;
      foto?: string | null;
    } & DefaultSession["user"]
  }

  interface User {
    eh_perfil_completo?: boolean;
    eh_administrador_geral?: boolean;
    eh_administrador_curso?: boolean;
    role_selecionado?: string | null;
    foto?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    eh_perfil_completo?: boolean;
    eh_administrador_geral?: boolean;
    eh_administrador_curso?: boolean;
    role_selecionado?: string | null;
    foto?: string | null;
  }
}