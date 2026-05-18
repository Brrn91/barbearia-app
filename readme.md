# ✂️ Barbearia App

Sistema de gerenciamento de agendamentos para barbearias.

## 🔗 Links

- **Frontend:** https://barbearia-app.vercel.app
- **Backend:** https://barbearia-app-production-62bc.up.railway.app

## 🚀 Tecnologias

- **Frontend:** HTML, TailwindCSS, JavaScript
- **Backend:** Node.js, Express
- **Banco de Dados:** PostgreSQL
- **Testes:** Jest
- **Logs:** Winston

## ⚙️ Funcionalidades

- ✅ Criar agendamentos
- ✅ Listar agendamentos
- ✅ Cancelar agendamentos
- ✅ Cadastro de clientes
- ✅ Cadastro de barbeiros
- ✅ Validação de horários duplicados
- ✅ Sistema de logs

## 🏗️ Estrutura do Projeto

```
barbearia-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── routes/
│   │   ├── services/
│   │   └── tests/
│   └── server.js
└── frontend/
    ├── css/
    ├── js/
    └── index.html
```

## 🛠️ Como rodar localmente

### Backend

```bash
cd backend
npm install
npm run dev
```

### Variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `backend`:

```
DATABASE_URL=sua_url_do_postgresql
PORT=3000
```

### Frontend

Abra o arquivo `frontend/index.html` no navegador.

## 🧪 Testes

````bash
cd backend
npm test
```🧪 Testes

```bash
cd backend
npm test
````
