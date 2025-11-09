# ClimbDelivery - Sistema de Gestão de Pedidos

## 📋 Sobre o Projeto

ClimbDelivery é um sistema web moderno e completo para gestão de pedidos de delivery, desenvolvido com Angular 19+ e PrimeNG.

## 🚀 Tecnologias Utilizadas

- **Angular 19.2+** - Framework frontend
- **PrimeNG 20+** - Biblioteca de componentes UI
- **PrimeFlex** - Utilitários CSS/Flex
- **PrimeIcons** - Biblioteca de ícones
- **SCSS** - Pré-processador CSS
- **RxJS** - Programação reativa
- **TypeScript** - Linguagem principal

## 📦 Estrutura do Projeto

```
src/app/
├── core/                  # Módulo principal (serviços, guards, interceptors, models)
│   ├── guards/           # Guards de roteamento (auth.guard.ts)
│   ├── interceptors/     # HTTP Interceptors (auth.interceptor.ts)
│   ├── services/         # Serviços globais (auth.service.ts, order.service.ts)
│   └── models/           # Interfaces e tipos (user.model.ts, order.model.ts)
├── shared/               # Componentes, pipes e diretivas compartilhadas
│   ├── components/
│   ├── directives/
│   └── pipes/
├── features/             # Módulos de funcionalidades
│   ├── auth/            # Módulo de autenticação
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   └── dashboard/       # Módulo do dashboard
│       ├── orders/      # Tela de pedidos (principal)
│       ├── menu/        # Gestor de cardápio
│       ├── settings/    # Configurações
│       ├── account/     # Minha conta
│       ├── delivery/    # Entregadores
│       └── reports/     # Relatórios
└── layout/              # Componentes de layout
    ├── main-layout/    # Layout principal
    ├── sidebar/        # Menu lateral
    └── header/         # Cabeçalho
```

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js 20.11+
- npm 10+
- Angular CLI 19+

### Passos para Instalação

1. **Instale as dependências**

```bash
npm install --legacy-peer-deps
```

2. **Execute o projeto**

```bash
npm start
# ou
ng serve
```

3. **Acesse no navegador**

```
http://localhost:4200
```

## 👤 Credenciais de Teste

Para acessar o sistema, utilize as seguintes credenciais:

- **Email:** admin@climbdelivery.com
- **Senha:** admin123

## 📱 Funcionalidades Principais

### 🔐 Autenticação
- [x] Login com validação de formulário
- [x] Esqueci a senha (mock)
- [x] Redefinir senha (mock)
- [x] Guard de proteção de rotas
- [x] Interceptor para adicionar token JWT

### 📊 Dashboard
- [x] **Meus Pedidos** - Gerenciamento de pedidos em kanban (3 colunas)
  - Em Análise
  - Em Produção
  - Pronto para Entrega
- [x] **Gestor de Cardápio** - Placeholder para produtos, categorias e adicionais
- [x] **Configurações** - Formulário de estabelecimento
- [x] **Minha Conta** - Gerenciamento de perfil e senha
- [x] **Entregadores** - Lista de entregadores (mock)
- [x] **Relatórios** - Dashboard de métricas e estatísticas

### 🎨 Layout e UX
- [x] Sidebar com menu hierárquico
- [x] Header com informações do usuário
- [x] Design responsivo (mobile, tablet, desktop)
- [x] Tema moderno Lara Light Blue
- [x] Animações e transições suaves
- [x] Feedback visual com toasts

## 🔄 Integração com Backend (Preparado)

O projeto está estruturado para fácil integração com backend NestJS + Prisma + PostgreSQL:

- **AuthService**: Métodos prontos para substituir mocks por chamadas HTTP
- **OrderService**: Estrutura preparada para requisições REST
- **Interceptor**: Configurado para adicionar JWT em headers
- **Models**: Interfaces TypeScript prontas para uso

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o servidor de desenvolvimento
ng serve              # Alternativa ao npm start

# Build
npm run build         # Build de produção
ng build              # Build de desenvolvimento

# Testes
npm test              # Executa testes unitários
```

## 🎯 Próximos Passos (Roadmap)

- [ ] Integração com backend NestJS
- [ ] Implementar CRUD completo de produtos
- [ ] Implementar CRUD de categorias e adicionais
- [ ] Sistema de notificações em tempo real (WebSocket)
- [ ] Impressão de pedidos
- [ ] Relatórios avançados com gráficos
- [ ] Módulo de cupons e promoções
- [ ] Gestão de estoque

---

**ClimbDelivery** - Sistema de Gestão de Pedidos para Delivery 🚀
