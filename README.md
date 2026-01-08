## Serviço de Inventário de Veículos

API responsável por cadastrar, editar e consultar veículos disponíveis na revenda.

### Tecnologias

- Node.js, TypeScript, Express
- Prisma com SQLite
- Jest para testes automatizados

### Como rodar localmente

- Instale as dependências com `npm install`
- Configure a variável `DATABASE_URL` em um arquivo `.env` (exemplo: `file:./dev.db`)
- Gere o cliente Prisma com `npm run prisma:generate`
- Crie a base e rode as migrações com `npm run prisma:migrate`
- Inicie a aplicação com `npm run dev`

### Testes

- Execute `npm test` para rodar os testes
- Execute `npm run coverage` para visualizar a cobertura (mínimo configurado de 80%)

