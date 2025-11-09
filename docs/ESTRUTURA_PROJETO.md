# 📁 Estrutura do Projeto

## Visão Geral da Arquitetura

O projeto ClimbDelivery segue uma arquitetura modular baseada em **standalone components** do Angular 19, organizada em módulos funcionais.

```
src/
├── app/
│   ├── core/               # Funcionalidades essenciais (singleton)
│   │   ├── guards/         # Guards de roteamento
│   │   ├── interceptors/   # Interceptors HTTP
│   │   ├── models/         # Interfaces e tipos
│   │   └── services/       # Serviços compartilhados
│   │
│   ├── shared/             # Componentes, pipes, directives reutilizáveis
│   │   ├── components/     # Componentes compartilhados
│   │   ├── pipes/          # Pipes customizados
│   │   └── directives/     # Diretivas customizadas
│   │
│   ├── features/           # Módulos de funcionalidades
│   │   ├── auth/           # Autenticação
│   │   │   ├── login/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── auth.routes.ts
│   │   │
│   │   └── dashboard/      # Dashboard principal
│   │       ├── orders/     # Gestão de pedidos
│   │       ├── menu/       # Cardápio
│   │       ├── delivery/   # Entregadores
│   │       ├── reports/    # Relatórios
│   │       ├── settings/   # Configurações
│   │       ├── account/    # Conta do usuário
│   │       └── dashboard.routes.ts
│   │
│   ├── layout/             # Componentes de layout
│   │   ├── main-layout/    # Layout principal
│   │   ├── header/         # Cabeçalho
│   │   └── sidebar/        # Menu lateral
│   │
│   ├── app.component.ts    # Componente raiz
│   ├── app.config.ts       # Configuração da aplicação
│   ├── app.routes.ts       # Rotas principais
│   └── app.routes.server.ts # Rotas do servidor (se SSR)
│
├── assets/                 # Recursos estáticos
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── styles.scss            # Estilos globais
├── main.ts               # Bootstrap da aplicação
└── index.html            # HTML principal
```

## 📦 Organização por Camadas

### 1. Core (Núcleo)
**Propósito:** Funcionalidades essenciais usadas em toda a aplicação.

**Regras:**
- Serviços devem ser singleton (providedIn: 'root')
- Não deve depender de features específicas
- Só pode ser importado UMA vez na aplicação

**Conteúdo:**
```typescript
core/
├── guards/
│   └── auth.guard.ts          // Guard de autenticação
├── interceptors/
│   └── auth.interceptor.ts    // Adiciona token JWT
├── models/
│   ├── user.model.ts          // Interfaces de usuário
│   └── order.model.ts         // Interfaces de pedido
└── services/
    ├── auth.service.ts        // Autenticação
    └── order.service.ts       // Gestão de pedidos
```

### 2. Shared (Compartilhado)
**Propósito:** Componentes, pipes e diretivas reutilizáveis.

**Regras:**
- Todos os componentes devem ser standalone
- Não deve ter dependências de features
- Pode ser usado em múltiplos lugares

**Exemplo de estrutura futura:**
```typescript
shared/
├── components/
│   ├── loading-spinner/
│   ├── empty-state/
│   └── confirmation-dialog/
├── pipes/
│   ├── currency-br.pipe.ts
│   └── time-ago.pipe.ts
└── directives/
    └── click-outside.directive.ts
```

### 3. Features (Funcionalidades)
**Propósito:** Módulos de negócio da aplicação.

**Regras:**
- Cada feature é independente
- Tem seu próprio arquivo de rotas (*.routes.ts)
- Componentes são standalone
- Lazy loading por padrão

**Estrutura de uma Feature:**
```typescript
features/
└── nome-feature/
    ├── componente-1/
    │   ├── componente-1.component.ts
    │   ├── componente-1.component.html
    │   ├── componente-1.component.scss
    │   └── componente-1.component.spec.ts
    ├── componente-2/
    └── nome-feature.routes.ts
```

### 4. Layout
**Propósito:** Componentes estruturais de layout.

**Regras:**
- Standalone components
- Focados em estrutura, não em lógica de negócio
- Reutilizáveis em diferentes contextos

```typescript
layout/
├── main-layout/          // Container principal
├── header/              // Cabeçalho com menu user
├── sidebar/             // Menu lateral
└── footer/              // Rodapé (futuro)
```

## 🎯 Princípios de Organização

### 1. Separação de Responsabilidades
- **Components:** UI e interação
- **Services:** Lógica de negócio e API
- **Models:** Definição de tipos
- **Guards:** Proteção de rotas
- **Interceptors:** Manipulação HTTP

### 2. DRY (Don't Repeat Yourself)
- Código repetido vai para `shared/`
- Lógica de negócio vai para `services/`
- Tipos compartilhados vão para `core/models/`

### 3. Single Responsibility
- Cada arquivo tem UMA responsabilidade
- Componentes pequenos e focados
- Services com métodos bem definidos

### 4. Lazy Loading
- Features são carregadas sob demanda
- Uso de `loadChildren` nas rotas
- Melhor performance inicial

## 📝 Convenções de Nomeação

### Pastas
- kebab-case (ex: `forgot-password/`)
- Singular para features (ex: `auth/`, `dashboard/`)
- Plural para coleções (ex: `guards/`, `services/`)

### Arquivos
```
nome-arquivo.tipo.extensão

Exemplos:
- login.component.ts
- auth.service.ts
- user.model.ts
- auth.guard.ts
- auth.interceptor.ts
```

### Arquivos de Rota
```
nome-feature.routes.ts

Exemplos:
- auth.routes.ts
- dashboard.routes.ts
- app.routes.ts (principal)
```

## 🔄 Fluxo de Dependências

```
┌─────────────────────────────────────────┐
│              Features                    │
│  (auth, dashboard, etc)                 │
└──────────────┬──────────────────────────┘
               │ imports
               ↓
┌─────────────────────────────────────────┐
│            Shared                        │
│  (components, pipes, directives)        │
└──────────────┬──────────────────────────┘
               │ imports
               ↓
┌─────────────────────────────────────────┐
│              Core                        │
│  (services, guards, models)             │
└─────────────────────────────────────────┘
```

**Regra de Ouro:** Dependências sempre fluem de cima para baixo. Core NUNCA importa de Features ou Shared.

## 🚀 Boas Práticas

### ✅ Fazer
- Manter features independentes
- Usar lazy loading
- Componentes standalone
- Services singleton no core
- Separar concerns (apresentação vs lógica)

### ❌ Evitar
- Importar features em outras features
- Core depender de features
- Componentes muito grandes (> 300 linhas)
- Lógica de negócio nos componentes
- Duplicação de código

## 📚 Referências

- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular Architecture](https://angular.dev/guide/architecture)
- [Standalone Components](https://angular.dev/guide/components/importing)
