'use client';

import { useState } from 'react';

export default function NovoCurso() {
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue
    
    // Limpa mensagens anteriores
    setMensagem('');
    setErro('');

    if (!nome.trim()) {
      setErro('O nome do curso é obrigatório.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro || 'Erro ao cadastrar curso.');
      } else {
        setMensagem(data.mensagem); 
        setNome(''); 
      }
    } catch (error) {
      setErro('Erro de conexão com o servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Cadastrar Novo Curso</h1>
          <p className="text-sm text-gray-500 mt-2">Área exclusiva do Administrador Geral</p>
        </div>

        {erro && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {erro}
          </div>
        )}
        {mensagem && (
          <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome do Curso
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Engenharia de Software"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Salvando...' : 'Cadastrar Curso'}
          </button>
        </form>
      </div>
    </div>
  );
}