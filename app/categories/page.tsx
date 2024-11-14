"use client";

import { useState } from "react";
import Layout from "../components/Layout";
import Table from "../components/Table";
import Modal from "../components/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useApi } from "../hooks/useApi";
import { z } from "zod";
import ErrorDisplay from "../components/ErrorDisplay";

interface Category {
  id: number;
  name: string;
  description: string;
  products: {
    id: number;
    name: string;
  }[];
}

const columns = [
  { key: "name", label: "Nome" },
  { key: "description", label: "Descrição" },
  {
    key: "products",
    label: "Produtos",
    format: (products: any[]) => products.length,
  },
];

const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
});

export default function Categories() {
  const {
    data: categories,
    loading,
    error,
    refetch,
  } = useApi<Category[]>("/api/categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Category | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || "",
    };

    try {
      const validatedData = categorySchema.parse(data);

      const url = currentItem
        ? `/api/categories/${currentItem.id}`
        : "/api/categories";

      const response = await fetch(url, {
        method: currentItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar categoria");
      }

      setIsModalOpen(false);
      setCurrentItem(null);
      setFormErrors({});
      await refetch();
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
        alert(
          error instanceof Error ? error.message : "Erro ao salvar categoria"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <Layout>
        <ErrorDisplay
          title="Erro ao carregar categorias"
          message={error}
          onRetry={refetch}
        />
      </Layout>
    );
  }

  return (
    <Layout loading={loading}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Categorias</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-5 w-5" />
          Nova Categoria
        </button>
      </div>

      <Table
        columns={columns}
        data={categories || []}
        onEdit={(item) => {
          setCurrentItem(item);
          setIsModalOpen(true);
        }}
        onDelete={async (item) => {
          if (!confirm("Tem certeza que deseja excluir esta categoria?"))
            return;

          try {
            const response = await fetch(`/api/categories/${item.id}`, {
              method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || "Erro ao excluir categoria");
            }

            await refetch();
            alert("Categoria excluída com sucesso!");
          } catch (error) {
            alert(
              error instanceof Error
                ? error.message
                : "Erro ao excluir categoria"
            );
            console.error("Erro:", error);
          }
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentItem(null);
          setFormErrors({});
        }}
        title={currentItem ? "Editar Categoria" : "Nova Categoria"}
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
              Descrição
            </label>
            <textarea
              name="description"
              defaultValue={currentItem?.description}
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
              rows={3}
            />
            {formErrors.description && (
              <p className="text-red-400 text-sm mt-1">
                {formErrors.description}
              </p>
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
