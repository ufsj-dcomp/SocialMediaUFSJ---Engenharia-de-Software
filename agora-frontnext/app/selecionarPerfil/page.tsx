"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ShieldAlert, BookOpen, GraduationCap } from 'lucide-react'

export default function SelecionarPerfilPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
 
  const ehAdminGeral = session?.user?.eh_administrador_geral;
  const ehAdminCurso = session?.user?.eh_administrador_curso;

  const escolherPerfil = async (role: string) => {
    await update({ role_selecionado: role });
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-100 shadow-xl text-center">
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Como você quer acessar hoje?</h1>
        <p className="text-slate-500 text-sm mb-8">
          Sua conta possui múltiplos níveis de acesso. Selecione o ambiente que deseja entrar:
        </p>

        <div className="flex flex-col gap-4">
          
          {ehAdminGeral && (
            <button 
              onClick={() => escolherPerfil('ADMIN_GERAL')}
              className="w-full border-2 border-indigo-100 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-4 px-4 rounded-xl transition flex items-center gap-4 text-left"
            >
              <div className="p-3 bg-indigo-600 rounded-full text-white">
                <ShieldAlert size={24} />
              </div>
              <div>
                <span className="block text-lg">Administrador Geral</span>
                <span className="text-xs font-normal opacity-80">Acesso total ao sistema e usuários</span>
              </div>
            </button>
          )}

          {ehAdminCurso && (
            <button 
              onClick={() => escolherPerfil('ADMIN_CURSO')}
              className="w-full border-2 border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-4 px-4 rounded-xl transition flex items-center gap-4 text-left"
            >
              <div className="p-3 bg-emerald-600 rounded-full text-white">
                <BookOpen size={24} />
              </div>
              <div>
                <span className="block text-lg">Coordenador do Curso</span>
                <span className="text-xs font-normal opacity-80">Gerencie turmas, professores e avisos</span>
              </div>
            </button>
          )}

          <button 
            onClick={() => escolherPerfil('ESTUDANTE')}
            className="w-full border-2 border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-4 px-4 rounded-xl transition flex items-center gap-4 text-left"
          >
            <div className="p-3 bg-slate-600 rounded-full text-white">
              <GraduationCap size={24} />
            </div>
            <div>
              <span className="block text-lg">Visão de Estudante</span>
              <span className="text-xs font-normal opacity-80">Acessar matérias, fóruns e o feed normal</span>
            </div>
          </button>

        </div>
      </div>
    </div>
  )
}