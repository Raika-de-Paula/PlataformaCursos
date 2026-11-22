# Neadro — Plataforma de Cursos Online

Plataforma web full-stack de ensino à distância (EAD) desenvolvida com arquitetura desacoplada (**MERN Stack**), oferecendo ambientes dedicados para **Alunos** e **Instrutores**, autenticação unificada com troca de perfil, gestão de cursos e suporte nativo a modo claro e escuro.

---

## Funcionalidades Principais

### Autenticação e Perfis
* **Login e Cadastro Unificados:** Interface com transição 3D (*flip-card*) para autenticação rápida e persistência de sessão (`localStorage` / `sessionStorage`).
* **Duplo Papel (Aluno & Instrutor):** O usuário pode alternar ou gerenciar perfis públicos e privados de estudante e instrutor.

### Visão do Aluno
* Catálogo e busca dinâmica de cursos na barra de navegação.
* Matrícula em cursos, acompanhamento de progresso e painel **Meus Cursos**.
* Sistema de comentários e avaliações nas aulas/cursos.
* Central de notificações em tempo real.

### Visão do Instrutor
* Criação, edição e gerenciamento completo de cursos, módulos e aulas.
* Upload e integração de imagens de capa e avatar via **Cloudinary** (com fallback para imagem padrão estática).
* Painel de perfil público do instrutor.

### Experiência do Usuário (UI/UX)
* **Tema Claro e Escuro:** Detecção automática conforme a preferência do sistema operacional na tela de autenticação (`prefers-color-scheme`) e alternância manual persistente na barra de navegação.
* **Design Responsivo:** Layout adaptável para desktop, tablet e dispositivos móveis.

---

## Tecnologias Utilizadas

### Front-end (`FrontEND/`)
* **React** + **Vite**
* **React Router DOM** (roteamento SPA)
* **Axios** (requisições HTTP com interceptors JWT)
* **Lucide React** & **React Icons** (iconografia)
* **React Hot Toast** (feedbacks visuais e alertas)
* **CSS3** (variáveis globais, animações 3D e media queries)

### Back-end (`BackEND/`)
* **Node.js** + **Express**
* **MongoDB** + **Mongoose** (modelagem de dados)
* **JSON Web Token (JWT)** & **bcryptjs** (autenticação e segurança)
* **Cloudinary** (armazenamento de mídia)
* **CORS** & **Dotenv**

---

## Estrutura do Projeto

```text
PlataformaCursos/
├── BackEND/
│   ├── src/
│   │   ├── config/          # Conexão com MongoDB e Cloudinary
│   │   ├── controllers/     # Regras de negócio (auth, cursos, usuários, etc.)
│   │   ├── images/          # Imagens estáticas padrão (ex: thumb2.jpg)
│   │   ├── middlewares/     # Autenticação JWT e validações
│   │   ├── models/          # Schemas do Mongoose
│   │   ├── routes/          # Definição das rotas da API REST
│   │   ├── utils/           # Funções auxiliares
│   │   ├── validators/      # Validação de dados de entrada
│   │   └── server.js        # Ponto de entrada do servidor Express
│   ├── package.json
│   └── vercel.json          # Configuração de deploy Serverless na Vercel
│
├── FrontEND/
│   ├── src/
│   │   ├── components/      # Navbar, busca, dropdown de notificações, etc.
│   │   ├── contexts/        # AuthContext e NotificationContext
│   │   ├── pages/           # Páginas de login, cursos, perfis e dashboards
│   │   ├── services/        # Configuração do cliente Axios (api.js)
│   │   ├── styles/          # Folhas de estilo modulares
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vercel.json          # Rewrites para rotas SPA na Vercel
│
├── .gitignore
└── README.md
```

---

## Como Executar Localmente

### Pré-requisitos
* **Node.js** (v18 ou superior)
* **MongoDB** instalado localmente ou uma conta no **MongoDB Atlas**
* Conta no **Cloudinary** (para upload de imagens)

### 1. Clonar o repositório
```bash
git clone [https://github.com/Raika-de-Paula/PlataformaCursos.git](https://github.com/Raika-de-Paula/PlataformaCursos.git)
cd PlataformaCursos
```

### 2. Configurar e iniciar o Back-end
```bash
cd BackEND
npm install
```

Crie um arquivo `.env` na raiz da pasta `BackEND/` com as seguintes variáveis:
```env
MONGO_URI=mongodb://127.0.0.1:27017/plataforma_cursos
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
FRONTEND_URL=http://localhost:5173
```

Inicie o servidor em modo de desenvolvimento:
```bash
npm run dev
```

### 3. Configurar e iniciar o Front-end
Em outro terminal, acesse a pasta do front-end:
```bash
cd FrontEND
npm install
```

Crie um arquivo `.env` na raiz da pasta `FrontEND/`:
```env
VITE_API_URL=http://localhost:3000
```

Inicie a aplicação React:
```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## Deploy (Vercel)

O repositório está estruturado para deploy independente na **Vercel** a partir do mesmo repositório GitHub:

1. **Back-end:** Importar o repositório selecionando o *Root Directory* como `BackEND` e configurar as variáveis de ambiente (`MONGO_URI` do MongoDB Atlas, `JWT_SECRET`, credenciais do `CLOUDINARY` e `FRONTEND_URL`).
2. **Front-end:** Importar o repositório selecionando o *Root Directory* como `FrontEND` e definir `VITE_API_URL` apontando para a URL pública gerada para a API.

---

## Autoria

Desenvolvido por **Raika Brasileiro de Paula** — Projeto acadêmico de Desenvolvimento Web Full-Stack.
