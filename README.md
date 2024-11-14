# GOATECH - Sistema de Gerenciamento de Estoque

## 📋 Sobre o Projeto

Este é um sistema de gerenciamento de estoque desenvolvido para pequenos negócios, oferecendo uma interface moderna e intuitiva para controle de produtos, fornecedores e transações.

## 🚀 Funcionalidades Principais

- **Gestão de Produtos**
  - Cadastro e edição de produtos
  - Controle de estoque
  - Imagens de produtos
  - Preços de compra e venda

- **Categorias**
  - Organização de produtos por categorias
  - Gerenciamento flexível de categorias

- **Fornecedores**
  - Cadastro completo de fornecedores
  - Histórico de fornecimento
  - Informações de contato

- **Transações**
  - Registro de entradas e saídas
  - Histórico detalhado
  - Validação de estoque

- **Dashboard**
  - Visão geral do negócio
  - Indicadores principais
  - Gráficos e estatísticas

## 🛠️ Tecnologias Utilizadas

- **Frontend**
  - Next.js 15.0.2
  - React 18.2.0
  - TailwindCSS
  - FontAwesome

- **Backend**
  - Prisma ORM
  - PostgreSQL
  - TypeScript
  - Zod (validação)

## 📦 Instalação

1. Clone o repositório:

git clone https://github.com/cauecalil/goatech.git

2. Instale as dependências:

npm install

3. Configure as variáveis de ambiente:

cp .env.example .env

4. Execute as migrações do banco de dados:

npx prisma migrate dev

5. Popule o banco com dados iniciais:

npx prisma db seed

6. Inicie o servidor de desenvolvimento:

npm run dev

## 🔧 Configuração

### Variáveis de Ambiente
DATABASE_URL="postgresql://user:password@localhost:5432/goatech"

## 📚 Documentação

### Estrutura do Projeto
goatech/
├── app/
│ ├── api/ # Endpoints da API
│ ├── components/ # Componentes React
│ ├── utils/ # Funções utilitárias
│ └── ... # Páginas da aplicação
├── prisma/
│ ├── schema.prisma # Schema do banco de dados
│ └── seed.ts # Script de seed
└── public/ # Arquivos estáticos

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

* **Cauê Calil** - *Desenvolvedor Principal* - [cauecalil](https://github.com/cauecalil)
* **Guilherme Muniz** - *Desenvolvedor Principal* - [guimunizzz](https://github.com/guimunizzz)

## 📞 Suporte

Para suporte, abra uma issue no repositório.

## 🎯 Status do Projeto

O projeto está em desenvolvimento ativo. Novas funcionalidades serão adicionadas regularmente.

## 🔮 Próximos Passos

- [ ] Implementação de autenticação de usuários
- [ ] Sistema de notificações
- [ ] Relatórios personalizados
- [ ] Integração com sistemas de PDV
- [ ] App mobile