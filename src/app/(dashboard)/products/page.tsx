"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import { useApi } from "@/hooks/useApi";
import { useNotifications } from "@/contexts/NotificationContext";
import { z } from "zod";
import { formatMoney } from "@/lib/utils/formatters";
import ErrorDisplay from "@/components/ErrorDisplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import ConfirmDialog from '@/components/ConfirmDialog'

interface Product {
  id: number;
  name: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  imageUrl?: string;
  category: {
    id: number;
    name: string;
  };
  supplier: {
    id: number;
    name: string;
  };
}

interface Supplier {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface ApiError {
  path: string[];
  message: string;
}

const columns = [
  {
    key: "imageUrl",
    label: "Imagem",
    format: (value: string) => (
      <Image
        src={value || "/placeholder-product.png"}
        alt="Produto"
        width={48}
        height={48}
        className="rounded-lg object-cover"
        onError={(e) => {
          e.currentTarget.src = "/placeholder-product.png";
        }}
      />
    ),
  },
  { key: "name", label: "Nome" },
  { 
    key: "description", 
    label: "Descrição",
    format: (value: string) => value ? (
      value.length > 30 ? `${value.substring(0, 30)}...` : value
    ) : '-'
  },
  {
    key: "buyPrice",
    label: "Preço de Compra",
    format: (value: number) => `${formatMoney(value)}`,
  },
  {
    key: "sellPrice",
    label: "Preço de Venda",
    format: (value: number) => `${formatMoney(value)}`,
  },
  { key: "category.name", label: "Categoria" },
  { key: "supplier.name", label: "Fornecedor" },
  {
    key: "quantity",
    label: "Estoque",
  },
];

const productSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    imageUrl: z.string().url("URL inválida").optional().or(z.literal("")),
    buyPrice: z.number().min(0, "Preço de compra deve ser maior que zero"),
    sellPrice: z.number().min(0, "Preço de venda deve ser maior que zero"),
    categoryId: z.number().min(1, "Categoria é obrigatória"),
    supplierId: z.number().min(1, "Fornecedor é obrigatório"),
  })
  .refine((data) => data.sellPrice > data.buyPrice, {
    message: "Preço de venda deve ser maior que o preço de compra",
    path: ["sellPrice"],
  });

export default function Products() {
  const {
    data: products,
    loading,
    error,
    refetch,
  } = useApi<Product[]>("/api/products");
  const { data: categoriesData } = useApi<Category[]>("/api/categories");
  const { data: suppliersData } = useApi<{ data: Supplier[] }>(
    "/api/suppliers"
  );
  const { addNotification } = useNotifications();
  const { isOpen, confirm, handleClose, handleConfirm } = useConfirmDialog()
  const [itemToDelete, setItemToDelete] = useState<Product | null>(null)

  const categories = categoriesData || [];
  const suppliers = suppliersData?.data || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Product | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (item: Product) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: Product) => {
    setItemToDelete(item)
    const confirmed = await confirm()
    
    if (confirmed) {
      try {
        const response = await fetch(`/api/products/${item.id}`, {
          method: 'DELETE'
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao excluir produto')
        }

        await refetch()
        addNotification('success', 'Produto excluído com sucesso!')
      } catch (error) {
        addNotification('error', error instanceof Error ? error.message : 'Erro ao excluir produto')
        console.error('Erro:', error)
      }
    }
    setItemToDelete(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || "",
        imageUrl: (formData.get("imageUrl") as string) || "",
        buyPrice: Number(formData.get("buyPrice")),
        sellPrice: Number(formData.get("sellPrice")),
        categoryId: Number(formData.get("categoryId")),
        supplierId: Number(formData.get("supplierId")),
      };

      const validationResult = productSchema.safeParse(data);
      if (!validationResult.success) {
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrors(errors);
        return;
      }

      const url = currentItem
        ? `/api/products/${currentItem.id}`
        : "/api/products";

      const response = await fetch(url, {
        method: currentItem ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error) {
          if (Array.isArray(errorData.error)) {
            const errors: Record<string, string> = {};
            errorData.error.forEach((err: ApiError) => {
              if (err.path) {
                errors[err.path[0]] = err.message;
              }
            });
            setFormErrors(errors);
          } else {
            throw new Error(
              typeof errorData.error === "string"
                ? errorData.error
                : "Erro ao salvar produto"
            );
          }
        }
        return;
      }

      setIsModalOpen(false);
      setCurrentItem(null);
      setFormErrors({});
      await refetch();
      addNotification("success", "Produto criado com sucesso!");
    } catch (error) {
      console.error("Erro completo:", error);
      const message =
        error instanceof Error ? error.message : "Erro ao salvar produto";
      addNotification("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <Layout>
        <ErrorDisplay
          title="Erro ao carregar produtos"
          message={error}
          onRetry={refetch}
        />
      </Layout>
    );
  }

  return (
    <Layout loading={loading}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <button
          onClick={() => {
            setCurrentItem(null);
            setIsModalOpen(true);
          }}
          className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-5 w-5" />
          Adicionar Produto
        </button>
      </div>

      <Table
        columns={columns}
        data={products || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentItem(null);
          setFormErrors({});
        }}
        title={currentItem ? "Editar Produto" : "Adicionar Produto"}
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
              required
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Preço de Compra
            </label>
            <input
              type="number"
              name="buyPrice"
              step="0.01"
              min="0"
              defaultValue={currentItem?.buyPrice}
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
              required
            />
            {formErrors.buyPrice && (
              <p className="text-red-400 text-sm mt-1">{formErrors.buyPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Preço de Venda
            </label>
            <input
              type="number"
              name="sellPrice"
              step="0.01"
              min="0"
              defaultValue={currentItem?.sellPrice}
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
              required
            />
            {formErrors.sellPrice && (
              <p className="text-red-400 text-sm mt-1">
                {formErrors.sellPrice}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Categoria
            </label>
            <select
              name="categoryId"
              defaultValue={currentItem?.category.id}
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {formErrors.categoryId && (
              <p className="text-red-400 text-sm mt-1">
                {formErrors.categoryId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              Fornecedor
            </label>
            <select
              name="supplierId"
              defaultValue={currentItem?.supplier.id}
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
              required
            >
              <option value="">Selecione um fornecedor</option>
              {Array.isArray(suppliers) &&
                suppliers.map((forn) => (
                  <option key={forn.id} value={forn.id}>
                    {forn.name}
                  </option>
                ))}
            </select>
            {formErrors.supplierId && (
              <p className="text-red-400 text-sm mt-1">
                {formErrors.supplierId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">
              URL da Imagem
            </label>
            <input
              type="url"
              name="imageUrl"
              defaultValue={currentItem?.imageUrl}
              placeholder="https://exemplo.com/imagem.jpg"
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
            />
            {formErrors.imageUrl && (
              <p className="text-red-400 text-sm mt-1">{formErrors.imageUrl}</p>
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
              {isSubmitting
                ? "Processando..."
                : currentItem
                ? "Atualizar"
                : "Adicionar"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Excluir produto"
        message={`Você tem certeza que deseja excluir o produto "${itemToDelete?.name}"? Esta ação não poderá ser desfeita.`}
      />
    </Layout>
  );
}
