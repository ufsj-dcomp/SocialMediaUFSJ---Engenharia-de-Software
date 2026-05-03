import React from 'react';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans">
      
      {/* Botão de Voltar */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition font-medium">
          <ArrowLeft size={20} />
          Voltar para Home
        </Link>
      </div>

      {/* Card de Login */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-100 shadow-xl">
        
        {/* Cabeçalho do Card */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="text-indigo-600 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bem-vindo de volta</h1>
          <p className="text-slate-500 text-sm mt-2">Acesse sua conta na Ágora</p>
        </div>

        {/* Formulário */}
        <form className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
              E-mail acadêmico
            </label>
            <input 
              type="email" 
              id="email"
              placeholder="seu.nome@aluno.instituicao.br"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                Senha
              </label>
              <a href="#" className="text-sm text-indigo-600 hover:underline font-medium">Esqueceu a senha?</a>
            </div>
            <input 
              type="password" 
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-md mt-2"
          >
            Entrar na plataforma
          </button>
        </form>

        {/* Rodapé do Card */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Ainda não tem uma conta?{' '}
          <Link href="/register" className="text-indigo-600 font-bold hover:underline">
            Crie agora
          </Link>
        </p>

      </div>
    </div>
  );
}