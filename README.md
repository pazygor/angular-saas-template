# 🚀 Angular SaaS Template

![Angular](https://img.shields.io/badge/Angular-19.2.19-red?logo=angular)
![PrimeNG](https://img.shields.io/badge/PrimeNG-20.3.0-blue?logo=primeng)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

**Template base profissional para projetos SaaS** com Angular 19 e PrimeNG. Estrutura completa com autenticação, layout responsivo e padrões de desenvolvimento já configurados.

---

## ✨ O que já vem pronto?

### 🔐 **Sistema de Autenticação Completo**
- ✅ Login com email/senha
- ✅ Esqueci minha senha
- ✅ Redefinir senha
- ✅ Logout com confirmação
- ✅ Guard de rotas protegidas
- ✅ HTTP Interceptor para tokens JWT
- ✅ AuthService com BehaviorSubject

### 🎨 **Layout Profissional**
- ✅ Header responsivo com menu dropdown
- ✅ Sidebar com menu hierárquico
- ✅ Layout main com router-outlet
- ✅ Menu lateral e superior funcionando
- ✅ Tema moderno (Lara Light Blue)
- ✅ Totalmente responsivo (mobile, tablet, desktop)

### 🖥️ **Telas Base do Dashboard**
- ✅ Minha Conta (perfil + alterar senha)
- ✅ Configurações (placeholder para settings)
- ✅ Relatórios (placeholder para métricas)

### 📚 **Documentação Completa**
- ✅ Padrões de desenvolvimento
- ✅ Padrões de componentes
- ✅ Padrões de rotas
- ✅ Padrões de services
- ✅ Guia de criação de telas
- ✅ Guia de formulários
- ✅ Guia de gestão de estado

### 🏗️ **Arquitetura Modular**
- ✅ Core module (guards, interceptors, services)
- ✅ Shared module (componentes reutilizáveis)
- ✅ Feature modules (auth, dashboard)
- ✅ Layout module (header, sidebar)
- ✅ Lazy loading configurado

---

## 🚀 Como usar este template

### Opção 1: Usar como Template no GitHub

1. Clique em "Use this template" no topo do repositório
2. Escolha um nome para seu novo projeto
3. Clone o repositório criado
4. Instale dependências: `npm install --legacy-peer-deps`
5. Execute: `npm start`

### Opção 2: Clone Manual

```bash
# Clone o template
git clone https://github.com/pazygor/angular-saas-template.git meu-projeto

# Entre na pasta
cd meu-projeto

# Remova o remote
git remote remove origin

# Adicione seu repositório
git remote add origin https://github.com/SEU_USUARIO/meu-projeto.git

# Instale dependências
npm install --legacy-peer-deps

# Execute
npm start
```

---

## 📦 Tecnologias Incluídas

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| [Angular](https://angular.io/) | 19.2.19 | Framework principal |
| [PrimeNG](https://primeng.org/) | 20.3.0 | Biblioteca de componentes UI |
| [PrimeFlex](https://primeflex.org/) | ^3.3.1 | Utility CSS (Grid, Flex) |
| [PrimeIcons](https://primeng.org/icons) | ^7.0.0 | Biblioteca de ícones |
| [TypeScript](https://www.typescriptlang.org/) | ~5.7.2 | Superset JavaScript tipado |
| [SCSS](https://sass-lang.com/) | - | Pré-processador CSS |
| [RxJS](https://rxjs.dev/) | ~7.8.0 | Programação reativa |

---

## 📁 Estrutura do Projeto

```
angular-saas-template/
├── src/
│   ├── app/
│   │   ├── core/                    # Módulo principal
│   │   │   ├── guards/              # Guards de rota
│   │   │   ├── interceptors/        # HTTP interceptors
│   │   │   ├── models/              # Interfaces e tipos
│   │   │   └── services/            # Services globais
│   │   │
│   │   ├── features/                # Módulos de funcionalidades
│   │   │   ├── auth/                # Autenticação completa
│   │   │   │   ├── login/
│   │   │   │   ├── forgot-password/
│   │   │   │   └── reset-password/
│   │   │   │
│   │   │   └── dashboard/           # Dashboard base
│   │   │       ├── settings/        # Configurações
│   │   │       ├── account/         # Minha conta
│   │   │       └── reports/         # Relatórios
│   │   │
│   │   ├── layout/                  # Componentes de layout
│   │   │   ├── header/              # Cabeçalho
│   │   │   ├── sidebar/             # Menu lateral
│   │   │   └── main-layout/         # Layout principal
│   │   │
│   │   └── shared/                  # Componentes compartilhados
│   │       ├── components/
│   │       ├── directives/
│   │       └── pipes/
│   │
│   └── styles.scss                  # Estilos globais
│
├── docs/                            # Documentação completa
│   ├── PADROES_DESENVOLVIMENTO.md
│   ├── PADROES_COMPONENTES.md
│   ├── PADROES_ROTAS.md
│   ├── PADROES_SERVICOS.md
│   ├── GUIA_NOVA_TELA.md
│   ├── GUIA_FORMULARIOS.md
│   └── GUIA_ESTADOS.md
│
└── README.md                        # Este arquivo
```

---

## 🎯 Próximos Passos

### 1️⃣ Personalize o Projeto

```bash
# Renomeie o projeto no package.json
"name": "meu-projeto-saas"

# Atualize os títulos no código
# src/index.html - <title>
# src/app/layout/sidebar - Nome do sistema
```

### 2️⃣ Adicione suas Features

Crie novas features usando a estrutura modular:

```bash
# Exemplo: criar módulo de clientes
ng generate module features/clientes --routing
ng generate component features/clientes/lista
ng generate component features/clientes/form
ng generate service features/clientes/services/cliente
```

### 3️⃣ Configure Backend

Atualize as URLs no environment:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // Sua API
};
```

### 4️⃣ Personalize o Menu

Edite o menu lateral em:

```typescript
// src/app/layout/sidebar/sidebar.component.ts
menuItems = [
  { label: 'Dashboard', icon: 'pi-home', routerLink: '/dashboard' },
  // Adicione seus itens...
];
```

---

## 🎨 Customização

### Trocar Tema PrimeNG

```typescript
// src/app/app.config.ts
providePrimeNG({
  theme: {
    preset: Lara, // Aura, Lara, Nora
    options: {
      darkModeSelector: '.my-app-dark'
    }
  }
})
```

### Trocar Cores

```scss
// src/styles.scss
:root {
  --primary-color: #3b82f6; // Sua cor primária
}
```

### Trocar Fonte

```scss
// src/styles.scss
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}
```

---

## 📚 Documentação Completa

Acesse a pasta [`docs/`](./docs/) para guias detalhados:

- **PADROES_DESENVOLVIMENTO.md** - Guia geral de padrões
- **PADROES_COMPONENTES.md** - Padrões de componentes
- **PADROES_ROTAS.md** - Padrões de rotas e lazy loading
- **PADROES_SERVICOS.md** - Padrões de services e HTTP
- **GUIA_NOVA_TELA.md** - Como criar novas telas
- **GUIA_FORMULARIOS.md** - Trabalho com formulários
- **GUIA_ESTADOS.md** - Gestão de estado

---

## 🤝 Contribuindo

Encontrou um bug ou tem uma sugestão? Abra uma issue ou pull request!

---

## 📝 Licença

MIT License - use como quiser! 🎉

---

## 🙏 Créditos

Template criado com:
- [Angular](https://angular.io/)
- [PrimeNG](https://primeng.org/)
- [PrimeFlex](https://primeflex.org/)

---

## 📸 Preview

### Tela de Login
![Login](docs/screenshots/login.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

---

**Desenvolvido com ❤️ para acelerar o desenvolvimento de SaaS**