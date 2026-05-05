"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GraduationCap, User, BookOpen, Camera } from 'lucide-react'

interface Curso {
  nome: string;
}

export default function CompletarPage() {
    const { data: session, update } = useSession()
    const router = useRouter()
  
    const [usuario, setUsuario] = useState('')
    const [curso, setCurso] = useState('')
    const [cursosLista, setCursosLista] = useState<Curso[]>([])

    const [fotoPreview, setFotoPreview] = useState<string | null>(null)
    const [fotoArquivo, setFotoArquivo] = useState<File | null>(null)
  
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const buscarCursos = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cursos`)
                if (response.ok) {
                    const data = await response.json()
                    setCursosLista(data)
                }
        } catch (error) {
            console.error("Erro ao buscar cursos:", error)
        }
    }
    buscarCursos()
    }, [])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFotoArquivo(file)
            setFotoPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('email', session?.user?.email || '')
    formData.append('usuario', usuario)
    formData.append('curso', curso)
    formData.append('nome', session?.user?.name || '')
    
    if (fotoArquivo) {
        formData.append('foto', fotoArquivo) 
    } else {
        formData.append('foto_url', session?.user?.image || '')
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/completar-perfil`, {
            method: 'POST',
            body: formData,
        })

        if (response.ok) {
            await update({ eh_perfil_completo: true })
            router.push('/selecionarPerfil')
        }
    } catch (error) {
        console.error("Erro ao enviar perfil:", error)
    }
}

    const fotoExibicao = fotoPreview || session?.user?.image

    return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-100 shadow-xl">
        
        <div className="flex flex-col items-center mb-8 text-center">
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 relative overflow-hidden border-4 border-white shadow-md cursor-pointer hover:opacity-90 transition group"
          >
            {fotoExibicao ? (
              <img src={fotoExibicao} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="text-indigo-600 w-8 h-8" />
            )}
            
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Camera size={24} className="text-white" />
            </div>
            
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quase lá, {session?.user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Precisamos de mais alguns detalhes para configurar sua experiência na Ágora.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome de usuário (@)</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                required
                type="text" 
                value={usuario}
                onChange={(e) => setUsuario(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                placeholder="ex: davy_salgado"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Seu Curso</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 text-slate-400" size={18} />
              <select 
                required
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition appearance-none bg-white"
              >
                <option value="">Selecione seu curso...</option>
                    {cursosLista.map((c) => (
                    <option key={c.nome} value={c.nome}>
                        {c.nome}
                    </option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-md mt-2 flex items-center justify-center gap-2"
          >
            Concluir meu Perfil
            <GraduationCap size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}