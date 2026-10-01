import { useEffect, useState } from "react";
import axios from "axios";

interface Pedido {
  id: number;
  produto: string;
  preco: number;
  status: string;
}

interface NovoPedido {
  produto: string;
  preco: number;
  status: string;
}

function App() {
  console.log(import.meta.env);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [novoPedido, setNovoPedido] = useState<NovoPedido>({
    produto: "",
    preco: 0,
    status: "",
  });
  const [editarPedido, setEditarPedido] = useState<Pedido | null>(null);
  const [isDeletarModalOpen, setIsDeletarModalOpen] = useState<Pedido | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleListarPedido = async () => {
    console.log("API:", import.meta.env.VITE_API_URL);

    const response = await axios.get<Pedido[]>(
      `${import.meta.env.VITE_API_URL}/pedidos`
    );

    console.log("URL:", response.config.url);
    console.log("Pedidos carregados:", response.data);

    setPedidos(response.data);
  };

  const handleNovoPedido = async () => {
    try {
      const response = await axios.post<Pedido>(
        `${import.meta.env.VITE_API_URL}/pedidos`,
        novoPedido
      );

      setPedidos([...pedidos, response.data]);

      setNovoPedido({
        produto: "",
        preco: 0,
        status: "",
      });

      console.log("Novo pedido criado:", response.data);
    } catch (error) {
      console.error("Erro ao criar novo pedido:", error);
    }
  };

  const handleEditarPedido = async () => {
    if (!editarPedido) return;
    setIsModalOpen(false);

    try {
      const response = await axios.put<Pedido[]>(
        `${import.meta.env.VITE_API_URL}/pedidos/${editarPedido.id}`,
        {
          produto: editarPedido.produto,
          preco: editarPedido.preco,
          status: editarPedido.status,
        }
      );

      const pedidoAtualizado = response.data[0];

      setPedidos(
        pedidos.map((pedido) =>
          pedido.id === pedidoAtualizado.id ? pedidoAtualizado : pedido
        )
      );

      setEditarPedido(null);
      setIsModalOpen(false);

      console.log("Pedido editado:", pedidoAtualizado);
    } catch (error) {
      console.error("Erro ao editar pedido:", error);
    }
  };

  const handleDeletarPedido = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/pedidos/${id}`);

      setPedidos(pedidos.filter((pedido) => pedido.id !== id));
      console.log("Pedido deletado:", id);
    } catch (error) {
      console.error("Erro ao deletar pedido:", error);
    }
  };

  useEffect(() => {
    handleListarPedido();
  }, []);

  return (
    <>
      <main className="min-h-screen bg-gray-100 p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Sistema de Pedidos
          </h1>

          <p className="mt-2 text-gray-500">
            Gerencie seus pedidos de forma simples e rápida.
          </p>
        </header>
        <section className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-1">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Novo Pedido
            </h2>
            <form>
              <label className="mb-4 block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Produto
                </span>

                <input
                  type="text"
                  value={novoPedido.produto}
                  onChange={(e) =>
                    setNovoPedido({
                      ...novoPedido,
                      produto: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Nome do produto"
                />
              </label>

              <label className="mb-4 block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Preço
                </span>

                <input
                  type="number"
                  value={novoPedido.preco}
                  onChange={(e) =>
                    setNovoPedido({
                      ...novoPedido,
                      preco: parseFloat(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="0,00"
                />
              </label>

              <label className="mb-6 block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </span>

                <select
                  value={novoPedido.status}
                  onChange={(e) =>
                    setNovoPedido({
                      ...novoPedido,
                      status: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Selecione o status</option>
                  <option value="pendente">Pendente</option>
                  <option value="processando">Processando</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </label>

              <button
                type="button"
                onClick={handleNovoPedido}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 cursor-pointer hover:text-white-600"
              >
                Criar Pedido
              </button>
            </form>{" "}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Pedidos Existentes
            </h2>
            {pedidos.length > 0 ? (
              <ul className="space-y-4">
                {pedidos.map((pedido) => (
                  <li
                    key={pedido.id}
                    className="rounded-xl border border-gray-200 p-4 transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-400">
                          Pedido #{pedido.id}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-gray-900">
                          {pedido.produto}
                        </h3>

                        <p className="mt-2 text-gray-600">R$ {pedido.preco}</p>
                      </div>

                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                        {pedido.status}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditarPedido(pedido);
                          setIsModalOpen(true);
                        }}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer hover:text-white-600"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDeletarModalOpen(pedido)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white cursor-pointer hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum pedido encontrado.</p>
            )}
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 ">
                  Editar Pedido
                </h2>

                <label className="mb-4 block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    Produto
                  </span>

                  <input
                    type="text"
                    value={editarPedido?.produto || ""}
                    onChange={(e) =>
                      setEditarPedido((prev) =>
                        prev ? { ...prev, produto: e.target.value } : null
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Nome do produto"
                  />
                </label>

                <label className="mb-4 block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    Preço
                  </span>

                  <input
                    type="number"
                    value={editarPedido?.preco || 0}
                    onChange={(e) =>
                      setEditarPedido((prev) =>
                        prev
                          ? { ...prev, preco: parseFloat(e.target.value) }
                          : null
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="0,00"
                  />
                </label>

                <label className="mb-6 block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </span>

                  <select
                    value={editarPedido?.status || ""}
                    onChange={(e) =>
                      setEditarPedido((prev) =>
                        prev ? { ...prev, status: e.target.value } : null
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Selecione o status</option>
                    <option value="pendente">Pendente</option>
                    <option value="processando">Processando</option>
                    <option value="finalizado">Finalizado</option>
                  </select>
                </label>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditarPedido(null);
                      setIsModalOpen(false);
                    }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={handleEditarPedido}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Salvar alterações
                  </button>
                </div>
              </div>
            </div>
          )}
          {isDeletarModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 ">
                  Confirmar Exclusão
                </h2>

                <p className="mb-6 text-gray-700">
                  Tem certeza de que deseja excluir o pedido "
                  {isDeletarModalOpen.produto}"?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDeletarModalOpen(null)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleDeletarPedido(isDeletarModalOpen.id);
                      setIsDeletarModalOpen(null);
                    }}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer hover:text-white-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
