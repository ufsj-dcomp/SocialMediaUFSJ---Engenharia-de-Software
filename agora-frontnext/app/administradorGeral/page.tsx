"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserPlus, ShieldCheck, ChevronDown, Users, BookOpen } from 'lucide-react'

interface Curso {
  id?: number; 
  nome: string;
}

interface Estudante {
  email: string;
  nome: string;
}

interface AdminCurso {
  admin_nome: string;
  admin_email: string;
  curso_nome: string;
}

export default function AdminGeralPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [abaAtiva, setAbaAtiva] = useState('adicionar') 

  const [emailNovoAdmin, setEmailNovoAdmin] = useState('')
  const [cursoSelecionado, setCursoSelecionado] = useState('')
  const [cursos, setCursos] = useState<Curso[]>([])
  const [estudantes, setEstudantes] = useState<Estudante[]>([])
  const [adminsCurso, setAdminsCurso] = useState<AdminCurso[]>([])
  const [mensagemAdmin, setMensagemAdmin] = useState({ tipo: '', texto: '' })

  const [formDataMateria, setFormDataMateria] = useState({
    nome: '',
    curso_nome: '',
    local: '',
    professor_atual: '',
    periodo: '',
    carga_horaria: '',
    horario: ''
  })
  const [mensagemMateria, setMensagemMateria] = useState({ tipo: '', texto: '' })
  const [loadingMateria, setLoadingMateria] = useState(false)

  const buscarAdmins = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/administradores-curso`)
      if (response.ok) {
        const data = await response.json()
        setAdminsCurso(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Erro ao buscar administradores:", error)
    }
  }

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
        
        buscarAdmins()
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
    setMensagemAdmin({ tipo: '', texto: '' })
    
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
        setMensagemAdmin({ tipo: 'sucesso', texto: 'Administrador de curso adicionado com sucesso!' })
        setEmailNovoAdmin('')
        setCursoSelecionado('')
        buscarAdmins()
      } else {
        const errorData = await response.json()
        setMensagemAdmin({ tipo: 'erro', texto: errorData.error || 'Usuário não encontrado.' })
      }
    } catch (error) {
      setMensagemAdmin({ tipo: 'erro', texto: 'Erro ao conectar com o servidor.' })
    }
  }

  const handleMateriaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDataMateria(prev => ({ ...prev, [name]: value }));
  };

  const handleCriarMateria = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemMateria({ tipo: '', texto: '' });
    setLoadingMateria(true);

    if (Object.values(formDataMateria).some(field => field === '')) {
      setMensagemMateria({ tipo: 'erro', texto: 'Por favor, preencha todos os campos obrigatórios.' });
      setLoadingMateria(false);
      return;
    }

    if (isNaN(Number(formDataMateria.carga_horaria)) || Number(formDataMateria.carga_horaria) <= 0) {
      setMensagemMateria({ tipo: 'erro', texto: 'A carga horária deve ser um número válido.' });
      setLoadingMateria(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/materias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formDataMateria,
          carga_horaria: Number(formDataMateria.carga_horaria)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMensagemMateria({ tipo: 'sucesso', texto: 'Matéria cadastrada com sucesso!' });
        setFormDataMateria({ nome: '', curso_nome: '', local: '', professor_atual: '', periodo: '', carga_horaria: '', horario: '' });
      } else {
        setMensagemMateria({ tipo: 'erro', texto: data.erro || 'Erro ao cadastrar matéria.' });
      }
    } catch (error) {
      setMensagemMateria({ tipo: 'erro', texto: 'Erro ao conectar com o servidor.' });
    } finally {
      setLoadingMateria(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-indigo-900 text-white flex flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <ShieldCheck className="text-indigo-300" size={32} />
          <span className="font-bold text-xl tracking-tight">AGORA Admin</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setAbaAtiva('adicionar')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition ${
              abaAtiva === 'adicionar' 
                ? 'bg-indigo-800 border border-indigo-700/50 shadow-sm' 
                : 'hover:bg-indigo-800/50 text-indigo-200 hover:text-white'
            }`}
          >
            <UserPlus size={20} />
            Adicionar Admin
          </button>

          <button 
            onClick={() => setAbaAtiva('listar')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition ${
              abaAtiva === 'listar' 
                ? 'bg-indigo-800 border border-indigo-700/50 shadow-sm' 
                : 'hover:bg-indigo-800/50 text-indigo-200 hover:text-white'
            }`}
          >
            <Users size={20} />
            Listar Administradores
          </button>

          <button 
            onClick={() => setAbaAtiva('adicionar-materia')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition ${
              abaAtiva === 'adicionar-materia' 
                ? 'bg-indigo-800 border border-indigo-700/50 shadow-sm' 
                : 'hover:bg-indigo-800/50 text-indigo-200 hover:text-white'
            }`}
          >
            <BookOpen size={20} />
            Adicionar Matéria
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 gap-4 shrink-0">
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

        <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
          
          {abaAtiva === 'adicionar' && (
            <div className="w-full max-w-xl mt-8">
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

                  {mensagemAdmin.texto && (
                    <div className={`mt-4 p-4 rounded-xl text-center text-sm font-bold border ${
                      mensagemAdmin.tipo === 'sucesso' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {mensagemAdmin.texto}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {abaAtiva === 'listar' && (
            <div className="w-full max-w-4xl mt-8">
               <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Administradores Cadastrados</h1>
                <p className="text-slate-500">Visualize e gerencie os administradores de curso do sistema.</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
                
                {adminsCurso.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-slate-400 font-medium">Nenhum administrador de curso cadastrado ainda.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-100">
                          <th className="pb-4 pt-2 px-4 font-semibold text-slate-600">Nome</th>
                          <th className="pb-4 pt-2 px-4 font-semibold text-slate-600">E-mail (UFSJ)</th>
                          <th className="pb-4 pt-2 px-4 font-semibold text-slate-600 text-right">Curso Gerenciado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminsCurso.map((admin, index) => (
                          <tr key={index} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-4 font-medium text-slate-800">
                              {admin.admin_nome}
                            </td>
                            <td className="py-4 px-4 text-slate-500 text-sm">
                              {admin.admin_email}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-indigo-100/50">
                                {admin.curso_nome}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
              </div>
            </div>
          )}

          {/* ABA ADICIONAR MATÉRIA INTEGRADA */}
          {abaAtiva === 'adicionar-materia' && (
            <div className="w-full max-w-3xl mt-8">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Adicionar Matéria</h1>
                <p className="text-slate-500">Cadastre uma nova disciplina e disponibilize-a para a grade curricular dos estudantes do curso.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-10">
                <form onSubmit={handleCriarMateria} className="space-y-6">
                  
                  {/* Divisão em Grid para economizar espaço vertical */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Nome da Matéria - Ocupa 2 colunas */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Nome da Matéria *</label>
                      <input 
                        type="text" 
                        name="nome"
                        value={formDataMateria.nome}
                        onChange={handleMateriaInputChange}
                        placeholder="Ex: Banco de Dados I" 
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>

                    {/* Curso Vinculado - Ocupa 2 colunas */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Curso Vinculado *</label>
                      <div className="relative">
                        <select 
                          name="curso_nome"
                          value={formDataMateria.curso_nome}
                          onChange={handleMateriaInputChange}
                          required
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

                    {/* Professor Atual */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Professor Atual *</label>
                      <input 
                        type="text" 
                        name="professor_atual"
                        value={formDataMateria.professor_atual}
                        onChange={handleMateriaInputChange}
                        placeholder="Nome do professor" 
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>

                    {/* Local */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Local (Sala/Prédio) *</label>
                      <input 
                        type="text" 
                        name="local"
                        value={formDataMateria.local}
                        onChange={handleMateriaInputChange}
                        placeholder="Ex: Sala 4.21 - Prédio CT" 
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>

                    {/* Período */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Período *</label>
                      <input 
                        type="text" 
                        name="periodo"
                        value={formDataMateria.periodo}
                        onChange={handleMateriaInputChange}
                        placeholder="Ex: 3º Período" 
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>

                    {/* Horário */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Horário *</label>
                      <input 
                        type="text" 
                        name="horario"
                        value={formDataMateria.horario}
                        onChange={handleMateriaInputChange}
                        placeholder="Ex: Terça e Quinta, 19h" 
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>

                    {/* Carga Horária - Ocupa 2 colunas */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Carga Horária (horas) *</label>
                      <input 
                        type="number" 
                        name="carga_horaria"
                        value={formDataMateria.carga_horaria}
                        onChange={handleMateriaInputChange}
                        placeholder="Ex: 72" 
                        required
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>

                  </div>

                  <button 
                    type="submit" 
                    disabled={loadingMateria}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-4"
                  >
                    <BookOpen size={22} />
                    {loadingMateria ? 'Salvando...' : 'Salvar Nova Matéria'}
                  </button>

                  {mensagemMateria.texto && (
                    <div className={`mt-4 p-4 rounded-xl text-center text-sm font-bold border ${
                      mensagemMateria.tipo === 'sucesso' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {mensagemMateria.texto}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}