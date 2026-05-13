# 💈 Sistema Completo de Agendamento para Barbearia

<div align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-green?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/Front--end-HTML%20%7C%20TailwindCSS%20%7C%20JavaScript-blue?style=for-the-badge" alt="Frontend">
  <img src="https://img.shields.io/badge/Back--end-Node.js%20%7C%20Express-darkgreen?style=for-the-badge" alt="Backend">
  <img src="https://img.shields.io/badge/API-REST-orange?style=for-the-badge" alt="API">
</div>

---

## 📝 Sobre o Projeto

O projeto de **Agendamento para Barbearia** é um sistema completo de gerenciamento e agendamento, desenvolvido para automatizar processos como controle de horários, serviços, clientes e administração da agenda.

O projeto foi estruturado com arquitetura separada entre **front-end**, **back-end** e **API REST**, simulando uma aplicação real de produção.

---

## 🎯 Objetivo

Este projeto foi criado para praticar e consolidar conhecimentos em:

* Desenvolvimento Full Stack
* Criação de APIs REST
* Organização de aplicações escaláveis
* Integração entre front-end e back-end
* Controle de autenticação e gerenciamento de dados
* Estruturação de sistemas administrativos

---

# 🧠 Funcionalidades

## 👤 Área do Cliente

* Cadastro e login de usuários
* Escolha de serviços
* Seleção de barbeiro
* Escolha de data e horário
* Visualização de horários disponíveis
* Histórico de agendamentos

---

## 💈 Gestão de Serviços

* Cadastro de serviços
* Alteração de preços
* Controle de duração do atendimento
* Ativação/desativação de serviços

---

## 📅 Sistema de Agendamento

* Controle automático de disponibilidade
* Bloqueio de horários ocupados
* Fechamento de agenda
* Regras de funcionamento por dia da semana

---

## 🛠 Painel Administrativo

* Dashboard administrativo
* Controle de clientes
* Gestão de horários
* Controle financeiro básico
* Relatórios de agendamentos

---

## 🔐 Autenticação

* Login seguro
* Controle de permissões
* Sessão de usuários
* Middleware de autenticação

---

## 🌐 API REST

A aplicação possui uma API responsável pela comunicação entre front-end e back-end.

---

# 🛠️ Stack Tecnológica

## 🎨 Front-end

* HTML5
* Tailwind CSS
* JavaScript (ES6+)

---

## ⚙️ Back-end

* Node.js
* Express.js

---

## 🗄 Banco de Dados (Planejado/Futuro)

* MongoDB
  ou
* PostgreSQL

---

## 🔧 Ferramentas

* Git
* GitHub
* VS Code
* Postman

---

# 📷 Demonstração

Fluxo do sistema:

```bash id="lf4q4d"
1. Cliente faz login
2. Escolhe serviço e barbeiro
3. Seleciona horário disponível
4. Sistema valida disponibilidade
5. Agendamento é registrado
6. Admin gerencia agenda pelo painel
```

Sugestão:

```id="iv6jng"
/docs/dashboard.png
/docs/demo.gif
```

---

# 📂 Estrutura do Projeto

```bash id="rxyk0h"
├── 📁 backend
│   ├── 📁 src
│   │   ├── 📁 controllers
│   │   │   └── 📄 agendamentoController.js
│   │   ├── 📁 database
│   │   │   ├── 📄 database.js
│   │   │   └── 📄 migrations.js
│   │   ├── 📁 routes
│   │   │   └── 📄 index.js
│   │   └── 📁 services
│   │       └── 📄 agendamentoService.js
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 seed.js
│   └── 📄 server.js
├── 📁 frontend
├── ⚙️ .gitignore
└── 📝 readme.md
```

---

# 🗺️ Roadmap

| Fase | Funcionalidade         | Status         |
| ---- | ---------------------- | -------------- |
| 01   | Estrutura Front-end    | ⏳ Em progresso|
| 02   | Sistema de Agendamento | ⏳ Em progresso|
| 03   | API REST               | ⏳ Em progresso|
| 04   | Painel Administrativo  | 📅 Planejado   |
| 05   | Banco de Dados         | 📅 Futuro      |
| 06   | Autenticação JWT       | 📅 Futuro      |
| 07   | Deploy em produção     | 📅 Futuro      |

---

# 🚀 Melhorias Futuras

* [ ] Integração com WhatsApp
* [ ] Notificações automáticas
* [ ] Sistema de pagamentos
* [ ] Dashboard financeiro avançado
* [ ] Deploy em nuvem
* [ ] Aplicação mobile
* [ ] Dark mode

---

# 📖 Aprendizados

Durante o desenvolvimento deste projeto, estão sendo praticados conceitos como:

* Desenvolvimento Full Stack
* Criação e consumo de APIs REST
* Estruturação de back-end com Node.js
* Organização de rotas e controllers
* Integração entre front-end e back-end
* Lógica de sistemas de agendamento

---

# 🤝 Contato

Lucas Bruno

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge\&logo=linkedin\&logoColor=white)](https://www.linkedin.com/in/brrn91/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/Brrn91)

---

> "Projetos completos não demonstram apenas código, demonstram capacidade de estruturar soluções reais."
