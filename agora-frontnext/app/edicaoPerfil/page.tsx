"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EdicaoPerfil(){
    const { data: session, update } = useSession();
    const router = useRouter();

    // Estados para campos editáveis
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [curso, setCurso] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [matricula, setMatricula] = useState("");
    const [foto, setFoto] = useState<File | null>(null);
    const [telefone, setTelefone] = useState("");
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    
    // Carrega dados do usuário
    useEffect(() => {
        if (session?.user) {
            setNome(session.user.name || "");
            //setTelefone(session.user.telefone || "");
            setPreview(session.user.foto || null);
        }
    }, [session]);

    const validarFoto = (file: File) => {
        const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];
        const tamanhoMaximo = 10*1024*1024; // 10MB

        if (!tiposPermitidos.includes(file.type)){
            setErro("Formato inválido. Use JPG, JPEG ou PNG.");
            return false;
        }
        if (file.size > tamanhoMaximo){
            setErro("O arquivo deve ter no máximo 10MB.");
            return false;
        }
        return true;
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file && validarFoto(file)){
            setErro("");
            setFoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("nome", nome);
        if (foto) formData.append("foto", foto);

        try {
            const response = await fetch("http://localhost:3001/usuarios/update-perfil", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session?.user?.accessToken}`
                },
                body: formData,
            });

            if(response.ok){
                alert("Perfil atualizado com sucesso.");
                // Atualiza a sessão do NextAuth para refletir os novos dados
                await update({ name: nome, image: preview });
                router.push("/");
            } else {
                setErro("Falha ao atualizar perfil.");
            }
        }  catch (err) {
            setErro("Erro de conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    }
    
return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-4">
        {/* Visualização de Informações Não Editáveis */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4 p-4 bg-gray-100 rounded">
          <div><p className="font-semibold">Email:</p> <p>{session?.user?.email}</p></div>
          <div><p className="font-semibold">Curso:</p> <p>{session?.user?.curso_nome}</p></div>
          <div><p className="font-semibold">Matrícula:</p> <p>{session?.user?.matricula}</p></div>
          <div><p className="font-semibold">Entrada:</p> <p>{session?.user?.periodo_entrada}</p></div>
        </div>

        {/* Campos Editáveis */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
          <div className="mt-2 flex items-center space-x-4">
            <img src={preview || "/default-avatar.png"} alt="Preview" className="h-16 w-16 rounded-full object-cover border" />
            <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFotoChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2" />
        </div>

        {erro && <p className="text-red-500 text-sm">{erro}</p>}

        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}