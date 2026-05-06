"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EdicaoPerfil() {
    const { data: session, update } = useSession();
    const router = useRouter();

    // Estados para campos (Editáveis e Não Editáveis para exibição)
    const [nome, setNome] = useState("");
    const [curso, setCurso] = useState("");
    const [telefone, setTelefone] = useState("");
    const [foto, setFoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    // 1. Busca dados direto do Banco (Pasta /back)
    useEffect(() => {
        const carregarDadosCompletos = async () => {
            if (session?.user?.email) {
                try {
                    // Usando a URL da API definida no seu .env
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/${session.user.email}`, {
                        headers: {
                            Authorization: `Bearer ${session.user.accessToken}`
                        }
                    });
                    
                    if (response.ok) {
                        const dadosDoBanco = await response.json();
                        setNome(dadosDoBanco.nome || "");
                        setCurso(dadosDoBanco.curso || "Não informado");
                        setPreview(dadosDoBanco.foto || null);
                    }
                } catch (err) {
                    console.error("Erro ao buscar dados do banco", err);
                }
            }
        };

        carregarDadosCompletos();
    }, [session]);

    const validarFoto = (file: File) => {
        const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
        const tamanhoMaximo = 10 * 1024 * 1024; // 10MB

        if (!tiposPermitidos.includes(file.type)) {
            setErro("Formato inválido. Use JPG, JPEG ou PNG.");
            return false;
        }
        if (file.size > tamanhoMaximo) {
            setErro("O arquivo deve ter no máximo 10MB.");
            return false;
        }
        return true;
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validarFoto(file)) {
            setErro("");
            setFoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErro("");

        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("curso", curso);
        if (foto) formData.append("foto", foto);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuario/update-perfil`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session?.user?.accessToken}`
                },
                body: formData,
            });

            if (response.ok) {
                alert("Perfil atualizado com sucesso.");
                // Atualiza o NextAuth localmente para mudar o nome/foto no Header sem precisar de refresh
                await update({ name: nome, image: preview });
                router.push("/");
            } else {
                const data = await response.json();
                setErro(data.error || "Falha ao atualizar perfil.");
            }
        } catch (err) {
            setErro("Erro de conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
                    <div className="mt-2 flex items-center space-x-4">
                        <img 
                            src={preview || "/default-avatar.png"} 
                            alt="Preview" 
                            className="h-16 w-16 rounded-full object-cover border-2 border-indigo-100" 
                        />
                        <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFotoChange} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    </div>
                </div>


                <div className="flex flex-col gap-3 text-sm text-gray-500 mb-4 p-4 bg-gray-100 rounded">
                  <div>
                      <p className="font-semibold">Email:</p> 
                      <p>{session?.user?.email}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-2"> {/* Linha opcional para separar */}
                      <p className="font-semibold">Curso:</p> 
                      <p>{curso}</p>
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border p-2 text-gray-800" />
                </div>

                <div className="flex flex-col gap-3 text-sm text-gray-500 mb-4 p-4 bg-gray-100 rounded">
                  <div>
                      <p className="font-semibold">Período de Entrada:</p> 
                  </div>
                  <div className="border-t border-gray-200 pt-2"> {/* Linha opcional para separar */}
                      <p className="font-semibold">Matrícula:</p> 
                  </div>
                  <div className="border-t border-gray-200 pt-2"> {/* Linha opcional para separar */}
                      <p className="font-semibold">Telefone:</p> 
                  </div>
                </div>

                {erro && <p className="text-red-500 text-sm font-medium">{erro}</p>}

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 shadow-sm transition">
                        {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </div>
            </form>
        </div>
    );
}