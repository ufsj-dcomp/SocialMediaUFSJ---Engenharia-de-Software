"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserPlus, ShieldCheck, ChevronDown } from 'lucide-react'

interface Curso {
  nome: string;
}

interface Estudante {
  email: string;
  nome: string;
}

export default function AdminGeralPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [emailNovoAdmin, setEmailNovoAdmin] = useState('')
  const [cursoSelecionado, setCursoSelecionado] = useState('')
  const [cursos, setCursos] = useState<Curso[]>([])
  const [estudantes, setEstudantes] = useState<Estudante[]>([])
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' })

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [resCursos, resEstudantes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/estudantes`)
        ])

        if (resCursos.ok) {
          setCursos(await resCursos.json())
        }
        if (resEstudantes.ok) {
          const data = await resEstudantes.json()
          setEstudantes(Array.isArray(data) ? data : (data.estudantes || []))
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
      }
    }
    buscarDados()
  }, [])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    )
  }

  const handlePromoverAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensagem({ tipo: '', texto: '' })
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/promover-administrador-curso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailNovoAdmin,
          curso: cursoSelecionado
        })
      })

      if (response.ok) {
        setMensagem({ tipo: 'sucesso', texto: 'Administrador de curso adicionado com sucesso!' })
        setEmailNovoAdmin('')
        setCursoSelecionado('')
      } else {
        const errorData = await response.json()
        setMensagem({ tipo: 'erro', texto: errorData.error || 'Usuário não encontrado.' })
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao conectar com o servidor.' })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-indigo-900 text-white flex flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <ShieldCheck className="text-indigo-300" size={32} />
          <span className="font-bold text-xl tracking-tight">AGORA Admin</span>
        </div>
        <nav className="flex-1">
          <button className="flex items-center gap-3 w-full p-3 bg-indigo-800 rounded-lg text-sm font-medium border border-indigo-700/50 shadow-sm">
            <UserPlus size={20} />
            Gerenciar Admins
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 gap-4">
          <div className="flex items-center gap-3 cursor-pointer group">
            <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition">Perfil</span>
            <img 
              src={session?.user?.foto || session?.user?.image || '/default-avatar.png'}
              alt="Avatar do Usuário" 
              className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover"
            />
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-xl">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Adicionar Administrador</h1>
              <p className="text-slate-500">Promova um estudante para administrar as matérias e fóruns de um curso.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-10">
              <form onSubmit={handlePromoverAdmin} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estudante (UFSJ)</label>
                  <div className="relative">
                    <select 
                      required
                      value={emailNovoAdmin}
                      onChange={(e) => setEmailNovoAdmin(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none cursor-pointer"
                    >
                      <option value="">Selecione o estudante...</option>
                      {Array.isArray(estudantes) && estudantes.map(est => (
                        <option key={est.email} value={est.email}>
                          {est.nome} ({est.email})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Curso a Administrar</label>
                  <div className="relative">
                    <select 
                      required
                      value={cursoSelecionado}
                      onChange={(e) => setCursoSelecionado(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none cursor-pointer"
                    >
                      <option value="">Selecione o curso...</option>
                      {cursos.map(c => (
                        <option key={c.nome} value={c.nome}>{c.nome}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  <UserPlus size={22} />
                  Salvar Novo Administrador
                </button>

                {mensagem.texto && (
                  <div className={`mt-4 p-4 rounded-xl text-center text-sm font-bold border ${
                    mensagem.tipo === 'sucesso' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {mensagem.texto}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}