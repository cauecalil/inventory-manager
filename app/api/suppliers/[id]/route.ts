import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const supplierSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  contact: z.string().min(1, 'Contato é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido')
})

type Params = { id: string }

type SupplierUpdateBody = z.infer<typeof supplierSchema>

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse> {
  try {
    const body: SupplierUpdateBody = await request.json()
    const validatedData = supplierSchema.parse(body)

    const supplier = await prisma.supplier.update({
      where: { id: Number(params.id) },
      data: validatedData,
      include: {
        products: true,
      },
    })

    return NextResponse.json(supplier)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Fornecedor não encontrado" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erro ao atualizar fornecedor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse> {
  try {
    const supplierId = Number(params.id)

    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: { products: true }
    })

    if (!supplier) {
      return NextResponse.json(
        { error: 'Fornecedor não encontrado' },
        { status: 404 }
      )
    }

    if (supplier.products.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um fornecedor que possui produtos vinculados' },
        { status: 400 }
      )
    }

    await prisma.supplier.delete({
      where: { id: supplierId }
    })

    return NextResponse.json({ message: 'Fornecedor excluído com sucesso' })
  } catch (error) {
    console.error("Erro ao excluir fornecedor:", error);
    return NextResponse.json(
      { error: "Erro ao excluir fornecedor" },
      { status: 500 }
    );
  }
}
