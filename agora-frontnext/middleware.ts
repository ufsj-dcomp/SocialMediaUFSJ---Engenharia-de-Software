import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    const estaLogado = !!token;
    const ehPerfilCompleto = token?.eh_perfil_completo;
    const ehAlgumAdministrador = token?.eh_administrador_geral || token?.eh_administrador_curso;
    const roleSelecionado = token?.role_selecionado;

    const pathCompletar = "/completarPerfil";
    const pathSelecionar = "/selecionarPerfil";
    const pathAdmin = "/administradorGeral";
    const pathEdicao = "/edicaoPerfil";
    const pathAtual = req.nextUrl.pathname; 

    const ehPathCompletar = pathAtual === pathCompletar;
    const ehPathSelecionar = pathAtual === pathSelecionar;

    if (estaLogado && !ehPerfilCompleto && !ehPathCompletar) {
      return NextResponse.redirect(new URL(pathCompletar, req.url));
    }

    if (estaLogado && ehPerfilCompleto && ehPathCompletar) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (estaLogado && ehPerfilCompleto && ehAlgumAdministrador && !roleSelecionado && !ehPathSelecionar) {
      return NextResponse.redirect(new URL(pathSelecionar, req.url));
    }

    if (pathAtual.startsWith("/administradorGeral") && roleSelecionado !== "ADMIN_GERAL") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/feed/:path*", 
    "/perfil/:path*", 
    "/completarPerfil", 
    "/selecionarPerfil", 
    "/administradorGeral/:path*",
    "/edicaoPerfil/:path*"
  ],
}