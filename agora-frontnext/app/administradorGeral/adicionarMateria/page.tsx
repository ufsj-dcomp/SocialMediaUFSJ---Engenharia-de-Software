'use client';

import React, { useState, useEffect } from 'react';


export default function AdicionarMateriaPage() {
  const [formData, setFormData] = useState({
    nome: '',
    curso_nome: '',
    local: '',
    professor_atual: '',
    periodo: '',
    carga_horaria: '',
    horario: ''
  });

  const [cursos, setCursos] = useState<{id: number, nome: string}[]>([]);
  const [mensagem, setMensagem] = useState<{texto: string, tipo: 'sucesso' | 'erro'} | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {

    setCursos([
      { id: 1, nome: 'Engenharia de Software' },
      { id: 2, nome: 'Ciência da Computação' }
    ]);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    setLoading(true);

    if (Object.values(formData).some(field => field === '')) {
      setMensagem({ texto: 'Por favor, preencha todos os campos obrigatórios.', tipo: 'erro' });
      setLoading(false);
      return;
    }

    if (isNaN(Number(formData.carga_horaria))) {
      setMensagem({ texto: 'A carga horária deve ser um número válido.', tipo: 'erro' });
      setLoading(false);
      return;
    }

    try {

      const response = await fetch('http://localhost:3001/api/materias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          carga_horaria: Number(formData.carga_horaria)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao cadastrar matéria.');
      }

      setMensagem({ texto: 'Matéria cadastrada com sucesso!', tipo: 'sucesso' });
      setFormData({ nome: '', curso_nome: '', local: '', professor_atual: '', periodo: '', carga_horaria: '', horario: '' });
      
    } catch (error: any) {
      setMensagem({ texto: error.message, tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] p-8">
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#0D1321] mb-2 font-mono">Adicionar Matéria</h1>
        <p className="text-gray-500 font-mono text-sm max-w-md mx-auto">
          Cadastre uma nova disciplina e disponibilize-a para a grade curricular dos estudantes do curso.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="grid grid-cols-2 gap-5">
            {/* Nome da Matéria */}
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-mono text-gray-700">Nome da Matéria *</label>
              <input 
                type="text" 
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Ex: Banco de Dados I" 
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* Curso */}
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-mono text-gray-700">Curso Vinculado *</label>
              <select 
                name="curso_nome"
                value={formData.curso_nome}
                onChange={handleInputChange}
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono appearance-none"
              >
                <option value="">Selecione o curso...</option>
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>{curso.nome}</option>
                ))}
              </select>
            </div>

            {/* Professor Atual */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-mono text-gray-700">Professor Atual *</label>
              <input 
                type="text" 
                name="professor_atual"
                value={formData.professor_atual}
                onChange={handleInputChange}
                placeholder="Nome do professor" 
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* Local */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-mono text-gray-700">Local (Sala/Prédio) *</label>
              <input 
                type="text" 
                name="local"
                value={formData.local}
                onChange={handleInputChange}
                placeholder="Ex: Sala 4.21 - Prédio CT" 
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* Período */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-mono text-gray-700">Período *</label>
              <input 
                type="text" 
                name="periodo"
                value={formData.periodo}
                onChange={handleInputChange}
                placeholder="Ex: 3º Período" 
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* Horário */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-mono text-gray-700">Horário *</label>
              <input 
                type="text" 
                name="horario"
                value={formData.horario}
                onChange={handleInputChange}
                placeholder="Ex: Terça e Quinta, 19h" 
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* Carga Horária */}
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-mono text-gray-700">Carga Horária (horas) *</label>
              <input 
                type="number" 
                name="carga_horaria"
                value={formData.carga_horaria}
                onChange={handleInputChange}
                placeholder="Ex: 72" 
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Botão de Submit */}
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-[#5C45FD] hover:bg-[#4b38d1] transition-colors text-white font-mono py-3 rounded-lg flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            {loading ? 'Salvando...' : 'Salvar Nova Matéria'}
          </button>
        </form>

        {/* Mensagens de Feedback */}
        {mensagem && (
          <div className={`mt-6 p-4 rounded-lg font-mono text-center text-sm ${mensagem.tipo === 'sucesso' ? 'bg-[#EAFBF3] text-[#2E8B57]' : 'bg-red-50 text-red-600'}`}>
            {mensagem.texto}
          </div>
        )}
      </div>
    </div>
  );
}