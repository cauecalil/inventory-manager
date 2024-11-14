"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useApi } from "../hooks/useApi";
import { z } from "zod";
import ErrorDisplay from "../components/ErrorDisplay";
import { useNotifications } from "../contexts/NotificationContext";

interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
  products: {
    id: number;
    name: string;
  }[];
}

const columns = [
  { key: "name", label: "Nome" },
  { key: "contact", label: "Contato" },
  { key: "phone", label: "Telefone" },
  { key: "email", label: "Email" },
  {
    key: "products",
    label: "Products",
    format: (products: any[]) => products.length,
  },
];

const supplierSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  contact: z.string().min(1, "Contato é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
});

export default function Suppliers() {
  const {
    data: response,
    loading,
    error,
    refetch,
  } = useApi<{
    data: Supplier[];
  }>(`/api/suppliers`);

  const suppliers = response?.data || [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Supplier | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      contact: formData.get("contact") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
    };

    try {
      const validatedData = supplierSchema.parse(data);

      const url = currentItem
        ? `/api/suppliers/${currentItem.id}`
        : "/api/suppliers";

      const response = await fetch(url, {
        method: currentItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar fornecedor");
      }

      setIsModalOpen(false);
      setCurrentItem(null);
      setFormErrors({});
      await refetch();
      addNotification('success', `Fornecedor ${currentItem ? 'atualizado' : 'criado'} com sucesso!`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        addNotification('error', error instanceof Error ? error.message : 'Erro ao salvar fornecedor');
        console.error("Erro:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: Supplier) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Supplier) => {
    if (!confirm("Tem certeza que deseja excluir este fornecedor?")) return;

    try {
      const response = await fetch(`/api/suppliers/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao excluir fornecedor");
      }

      await refetch();
      addNotification('success', 'Fornecedor excluído com sucesso!');
    } catch (error) {
      addNotification('error', error instanceof Error ? error.message : 'Erro ao excluir fornecedor');
      console.error("Erro:", error);
    }
  };

  return (
    <Layout loading={loading}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Fornecedores</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-5 w-5" />
          Novo Fornecedor
        </button>
      </div>

      {error ? (
        <ErrorDisplay
          title="Erro ao carregar fornecedores"
          message={error}
          onRetry={refetch}
        />
      ) : (
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-[#1E2023]/50 flex items-center justify-center rounded-lg z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22c55e]"></div>
            </div>
          )}
          <Table
            data={suppliers}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      <Modal
        title={`${currentItem ? "Editar" : "Novo"} Fornecedor`}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentItem(null);
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Nome
            </label>
            <input
              type="text"
              name="name"
              defaultValue={currentItem?.name}
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
            />
            {formErrors.name && (
              <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Contato
            </label>
            <input
              type="text"
              name="contact"
              defaultValue={currentItem?.contact}
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
            />
            {formErrors.contact && (
              <p className="text-red-400 text-sm mt-1">{formErrors.contact}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Telefone
            </label>
            <input
              type="tel"
              name="phone"
              defaultValue={currentItem?.phone}
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
            />
            {formErrors.phone && (
              <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={currentItem?.email}
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
            />
            {formErrors.email && (
              <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-4 py-2 rounded-lg ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Processando..." : currentItem ? "Atualizar" : "Adicionar"}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
