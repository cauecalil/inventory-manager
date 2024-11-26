import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Cleaning existing data...')
    await prisma.user.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.supplier.deleteMany()

    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@goatech.com' },
      update: {},
      create: {
        name: 'Administrador',
        email: 'admin@goatech.com',
        password: adminPassword,
      },
    })
  
    console.log('Usuário admin criado:', admin)

    const categoriesData = [
      { name: 'Lanches', description: 'Diversos tipos de lanches' },
      { name: 'Bebidas', description: 'Bebidas variadas' },
      { name: 'Porções', description: 'Porções para acompanhar os lanches' },
      { name: 'Sobremesas', description: 'Doces e sobremesas' },
      { name: 'Saladas', description: 'Saladas frescas e saudáveis' },
      { name: 'Snacks', description: 'Petiscos rápidos' },
      { name: 'Massas', description: 'Pratos à base de massas' },
      { name: 'Especiais', description: 'Pratos exclusivos e especiais' },
    ]

    console.log('Creating categories...')
    const categories = await Promise.all(
      categoriesData.map(cat =>
        prisma.category.create({
          data: cat
        })
      )
    )

    const suppliersData = [
      { 
        name: 'Alimentos Premium Ltda.', 
        contact: 'Carlos Eduardo Silva', 
        phone: '(11) 91234-5678', 
        email: 'contato@alimentospremium.com.br' 
      },
      { 
        name: 'Distribuidora ABC', 
        contact: 'Fernanda Oliveira', 
        phone: '(21) 92345-6789', 
        email: 'fernanda@distribuidorabc.com.br' 
      },
      { 
        name: 'Sabor & Cia.', 
        contact: 'Ricardo Santos', 
        phone: '(31) 93456-7890', 
        email: 'ricardo@saborecia.com.br' 
      },
      { 
        name: 'Forno Bom Fornecedor', 
        contact: 'Ana Paula Pereira', 
        phone: '(41) 94567-8901', 
        email: 'ana.paula@fornobom.com.br' 
      },
      { 
        name: 'Importadora XYZ', 
        contact: 'Lucas Souza', 
        phone: '(51) 95678-9012', 
        email: 'lucas@importadoraxyz.com.br' 
      },
      { 
        name: 'Distribuições São Paulo', 
        contact: 'Mariana Lima', 
        phone: '(61) 96789-0123', 
        email: 'mariana@distribuicoespaulo.com.br' 
      },
      { 
        name: 'Mercados Integrados Ltda.', 
        contact: 'Bruno Costa', 
        phone: '(71) 97890-1234', 
        email: 'bruno@mercadosintegrados.com.br' 
      },
      { 
        name: 'Alimentos Naturais SA', 
        contact: 'Juliana Rocha', 
        phone: '(81) 98901-2345', 
        email: 'juliana@alimentosnaturais.com.br' 
      },
      { 
        name: 'Fornecedor Central', 
        contact: 'Pedro Martins', 
        phone: '(91) 99012-3456', 
        email: 'pedro@fornecedorcentral.com.br' 
      },
      { 
        name: 'Distribuidora Alpha', 
        contact: 'Camila Dias', 
        phone: '(85) 90123-4567', 
        email: 'camila@distributoraalpha.com.br' 
      },
      { 
        name: 'Fresh Foods Supply', 
        contact: 'Ricardo Almeida', 
        phone: '(19) 91234-5678', 
        email: 'ricardo@freshfoodssupply.com.br' 
      },
      { 
        name: 'Maxi Distribuições', 
        contact: 'Sofia Martins', 
        phone: '(27) 92345-6789', 
        email: 'sofia@maxidistribuicoes.com.br' 
      },
      { 
        name: 'Comprar Fácil Ltda.', 
        contact: 'Thiago Ferreira', 
        phone: '(35) 93456-7890', 
        email: 'thiago@comprarfacil.com.br' 
      },
      { 
        name: 'Super Fornecedores', 
        contact: 'Isabela Gomes', 
        phone: '(47) 94567-8901', 
        email: 'isabela@superfornecedores.com.br' 
      },
      { 
        name: 'Distribuidora Universal', 
        contact: 'Felipe Ramos', 
        phone: '(55) 95678-9012', 
        email: 'felipe@distribuidorouniversal.com.br' 
      },
    ]

    console.log('Creating suppliers...')
    const suppliers = await Promise.all(
      suppliersData.map(supplier =>
        prisma.supplier.create({
          data: supplier
        })
      )
    )

    const productNames = [
      'Hambúrguer Clássico',
      'Cheeseburguer',
      'X-Bacon',
      'X-Tudo',
      'Pizza Calabresa',
      'Pizza Margherita',
      'Coca-Cola 500ml',
      'Suco Natural de Laranja',
      'Batata Frita',
      'Onion Rings',
      'Salada Caesar',
      'Espaguete à Bolonhesa',
      'Lasagna',
      'Milkshake de Chocolate',
      'Sorvete de Baunilha',
      'Tira-Gosto de Frango',
      'Espetinho de Carne',
      'Pão de Alho',
      'Caldo Verde',
      'Bruschetta',
      'Wrap Vegetariano',
      'Taco de Carne',
      'Salmão Grelhado',
      'Frango à Passarinho',
      'Provolone',
      'Queijo Coalho',
      'Empanado de Frango',
      'Nuggets',
      'Espetinho de Camarão',
      'Picanha na Brasa',
      'Feijoada Completa',
      'Churrasco Misto',
      'Vinho Tinto',
      'Cerveja Artesanal',
      'Água Mineral',
      'Energético Red Bull',
      'Chá Gelado',
      'Granola com Iogurte',
      'Bolo de Cenoura',
      'Brownie de Chocolate',
      'Torta de Limão',
      'Mousse de Maracujá',
      'Pudim de Leite',
      'Cupcake de Baunilha',
      'Docinho de Brigadeiro',
      'Pé de Moleque',
      'Canjica',
      'Picolé de Frutas',
      'Pão de Queijo',
      'Cachaça Artesanal',
    ]

    const productDescriptions = [
      'Delicioso e suculento, perfeito para qualquer hora do dia.',
      'Preparado com ingredientes de alta qualidade para garantir o melhor sabor.',
      'Uma combinação clássica que nunca sai de moda.',
      'Ideal para quem busca um lanche mais completo e saboroso.',
      'Feita com molho especial e ingredientes selecionados.',
      'Sabor autêntico italiano que encanta todos os paladares.',
      'Bebida refrescante para acompanhar sua refeição.',
      'Suculento e natural, sem adição de açúcares.',
      'Crocrante por fora e macio por dentro, sempre uma boa pedida.',
      'Uma explosão de sabores em cada mordida.',
      'Salada completa com molho Caesar caseiro.',
      'Espaguete com molho de carne rico e saboroso.',
      'Camadas de massa e molho bem temperado.',
      'Creme espesso e cremoso com sabor intenso de chocolate.',
      'Sorvete suave e delicioso, ideal para qualquer ocasião.',
      'Perfeito para compartilhar com os amigos.',
      'Espetinhos suculentos e saborosos.',
      'Pão delicioso com aroma irresistível de alho.',
      'Caldo tradicional com ingredientes frescos.',
      'Entrada leve e saborosa para iniciar sua refeição.',
      'Wrap recheado com ingredientes frescos e saborosos.',
      'Taco crocante com recheio de carne temperada.',
      'Salmão grelhado com temperos especiais.',
      'Frango crocante e saboroso, ideal para qualquer refeição.',
      'Queijo derretido com sabor marcante.',
      'Queijo coalho grelhado na perfeição.',
      'Filé de frango empanado e crocante.',
      'Pequenas porções de nuggets crocantes.',
      'Camarões grelhados com tempero especial.',
      'Picanha suculenta assada na brasa.',
      'Feijoada completa com todos os acompanhamentos.',
      'Churrasco variado com carnes selecionadas.',
      'Vinho tinto encorpado, ideal para harmonizar.',
      'Cerveja artesanal com sabor único.',
      'Água mineral pura para hidratação.',
      'Energético para dar aquele gás no seu dia.',
      'Chá gelado refrescante para qualquer hora.',
      'Granola crocante servida com iogurte natural.',
      'Bolo fofinho de cenoura com cobertura de chocolate.',
      'Brownie denso e cheio de sabor.',
      'Torta de limão com base crocante e recheio cremoso.',
      'Mousse leve e refrescante de maracujá.',
      'Pudim cremoso de leite condensado.',
      'Cupcake macio com cobertura de baunilha.',
      'Docinho tradicional de brigadeiro para adoçar seu dia.',
      'Pé de moleque crocante com amendoim na medida certa.',
      'Canjica doce e cremosa, perfeita para o inverno.',
      'Picolé de frutas naturais, refrescante e saboroso.',
      'Pão de queijo quentinho e derretido.',
      'Cachaça artesanal com sabor único e marcante.',
    ]

    console.log('Creating products...')
    const products = await Promise.all(
      productNames.map((name, index) => {
        const category = categories[index % categories.length]
        const supplier = suppliers[index % suppliers.length]
        const buyPrice = parseFloat((Math.random() * (50 - 5) + 5).toFixed(2))
        const sellPrice = parseFloat((buyPrice + Math.random() * (100 - buyPrice)).toFixed(2))
        return prisma.product.create({
          data: {
            name: name,
            description: productDescriptions[index % productDescriptions.length],
            buyPrice: new Prisma.Decimal(buyPrice),
            sellPrice: new Prisma.Decimal(sellPrice),
            categoryId: category.id,
            supplierId: supplier.id,
            imageUrl: 'https://via.placeholder.com/128x128?text=Product',
          }
        })
      })
    )

    console.log('Creating initial transactions...')
    const startDate = new Date(2024, 0, 1)
    const endDate = new Date()

    for (const product of products) {
      const initialQuantity = Math.floor(Math.random() * (200 - 50 + 1)) + 50
      await prisma.transaction.create({
        data: {
          type: 'IN',
          quantity: initialQuantity,
          unitPrice: product.buyPrice,
          totalValue: product.buyPrice.mul(new Prisma.Decimal(initialQuantity)),
          productId: product.id,
          date: startDate
        }
      })
    }

    console.log('Generating random transactions...')
    const transactions: Prisma.TransactionCreateManyInput[] = []
    const batchSize = 100

    const types = ['IN', 'OUT'] as const

    function generateRandomDate(start: Date, end: Date): Date {
      const timeDiff = end.getTime() - start.getTime()
      const randomDiff = Math.random() * timeDiff
      return new Date(start.getTime() + randomDiff)
    }

    for (let i = 0; i < 1000; i++) {
      const product = products[Math.floor(Math.random() * products.length)]
      const type = types[Math.floor(Math.random() * types.length)]
      const quantity = Math.floor(Math.random() * 10) + 1
      const unitPrice = type === 'IN' ? product.buyPrice : product.sellPrice
      const totalValue = unitPrice.mul(new Prisma.Decimal(quantity))
      const randomDate = generateRandomDate(startDate, endDate)

      transactions.push({
        type: type,
        quantity: quantity,
        unitPrice: unitPrice,
        totalValue: totalValue,
        productId: product.id,
        date: randomDate
      })

      if (transactions.length >= batchSize) {
        await prisma.transaction.createMany({ data: transactions })
        transactions.length = 0
      }
    }

    if (transactions.length > 0) {
      await prisma.transaction.createMany({ data: transactions })
    }

    console.log('Seed completed successfully!')
  } catch (error) {
    console.error('Error during seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
