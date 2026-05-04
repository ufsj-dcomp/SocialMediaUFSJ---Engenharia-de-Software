import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const estaLogado = !!req.nextauth.token;
    const ehPerfilCompleto = req.nextauth.token?.eh_perfil_completo;
    const ehCaminhoCompletarPerfil = req.nextUrl.pathname.startsWith("/completarPerfil");

    if (estaLogado && !ehPerfilCompleto && !ehCaminhoCompletarPerfil) {
      return NextResponse.redirect(new URL("/completarPerfil", req.url));
    }

    //ainda tenho que saber para onde mandar o cara depois de completar o perfil
    if (estaLogado && ehPerfilCompleto && ehCaminhoCompletarPerfil) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

//Rotas de exemplo (feed, perfil, grupos), ainda não é definitivo.
export const config = {
  matcher: ["/feed/:path*", "/perfil/:path*", "/grupos/:path*", "/completarPerfil"],
}