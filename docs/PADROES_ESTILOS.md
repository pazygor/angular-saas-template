# 🎨 Padrões de Estilos e UI

## Stack de Estilos

- **PrimeNG 20.3.0** - Componentes UI
- **PrimeFlex 4.0.0** - Utility classes CSS
- **PrimeIcons 7.0.0** - Ícones
- **SCSS** - Pré-processador CSS
- **Tema:** Lara (via @primeng/themes)

## 🎨 Sistema de Design

### Cores

```scss
// Cores Primárias (definidas no tema Lara)
--primary-color: #3B82F6;        // Azul principal
--primary-dark: #2563EB;         // Azul escuro
--primary-light: #60A5FA;        // Azul claro

// Cores de Superfície
--surface-ground: #f8fafc;       // Fundo da página
--surface-card: #ffffff;         // Fundo de cards
--surface-border: #e2e8f0;       // Bordas

// Cores de Texto
--text-color: #1e293b;           // Texto principal
--text-color-secondary: #64748b; // Texto secundário
--text-color-muted: #94a3b8;     // Texto desativado

// Cores de Estado
--green-500: #22c55e;            // Sucesso
--red-500: #ef4444;              // Erro
--yellow-500: #eab308;           // Aviso
--blue-500: #3b82f6;             // Info
```

### Tipografia

```scss
// Fonte Principal
font-family: 'Poppins', sans-serif;

// Pesos
font-weight: 300; // Light
font-weight: 400; // Regular
font-weight: 500; // Medium
font-weight: 600; // SemiBold
font-weight: 700; // Bold

// Tamanhos (use classes PrimeFlex)
.text-xs    // 0.75rem (12px)
.text-sm    // 0.875rem (14px)
.text-base  // 1rem (16px)
.text-lg    // 1.125rem (18px)
.text-xl    // 1.25rem (20px)
.text-2xl   // 1.5rem (24px)
.text-3xl   // 1.875rem (30px)
```

### Espaçamentos (PrimeFlex)

```scss
// Padding e Margin
.p-0  // 0
.p-1  // 0.25rem (4px)
.p-2  // 0.5rem (8px)
.p-3  // 0.75rem (12px)
.p-4  // 1rem (16px)
.p-5  // 1.5rem (24px)
.p-6  // 2rem (32px)

// Variações
.pt-4  // padding-top
.pb-4  // padding-bottom
.pl-4  // padding-left
.pr-4  // padding-right
.px-4  // padding horizontal
.py-4  // padding vertical

// Mesmo padrão para margin (m-)
.mt-4, .mb-4, .ml-4, .mr-4, .mx-4, .my-4
```

## 🎯 Padrões de Layout

### Grid System (PrimeFlex)

```html
<!-- Container responsivo -->
<div class="grid">
  <!-- 12 colunas no desktop, 6 no tablet, 12 no mobile -->
  <div class="col-12 md:col-6 lg:col-4">
    <p-card>Conteúdo</p-card>
  </div>
  <div class="col-12 md:col-6 lg:col-4">
    <p-card>Conteúdo</p-card>
  </div>
  <div class="col-12 md:col-6 lg:col-4">
    <p-card>Conteúdo</p-card>
  </div>
</div>
```

### Breakpoints

```scss
// Mobile First (PrimeFlex)
sm:   576px   // Tablets
md:   768px   // Tablets landscape
lg:   992px   // Desktop
xl:   1200px  // Desktop large
```

### Layout Padrão de Tela

```html
<!-- Container principal -->
<div class="p-4 md:p-6">
  <!-- Cabeçalho da página -->
  <div class="flex align-items-center justify-content-between mb-4">
    <h1 class="text-3xl font-semibold m-0">Título da Página</h1>
    <button pButton label="Nova Ação" icon="pi pi-plus"></button>
  </div>

  <!-- Conteúdo -->
  <div class="grid">
    <div class="col-12">
      <p-card>
        <!-- Conteúdo do card -->
      </p-card>
    </div>
  </div>
</div>
```

## 🧩 Componentes PrimeNG

### Botões

```html
<!-- Botão Primário -->
<button 
  pButton 
  label="Salvar"
  icon="pi pi-check"
  class="p-button-primary"
></button>

<!-- Botão Secundário -->
<button 
  pButton 
  label="Cancelar"
  icon="pi pi-times"
  class="p-button-secondary"
></button>

<!-- Botão Texto -->
<button 
  pButton 
  label="Limpar"
  class="p-button-text"
></button>

<!-- Botão com Loading -->
<button 
  pButton 
  label="Salvando..."
  [loading]="loading"
></button>

<!-- Botão Ícone apenas -->
<button 
  pButton 
  icon="pi pi-trash"
  class="p-button-rounded p-button-danger p-button-text"
></button>
```

### Cards

```html
<!-- Card Básico -->
<p-card header="Título do Card">
  <p>Conteúdo do card</p>
</p-card>

<!-- Card com Template Customizado -->
<p-card styleClass="shadow-2">
  <ng-template pTemplate="header">
    <div class="flex align-items-center justify-content-between p-3">
      <h3 class="m-0">Pedido #123</h3>
      <span class="badge bg-primary">Novo</span>
    </div>
  </ng-template>

  <div class="p-3">
    <p>Conteúdo principal</p>
  </div>

  <ng-template pTemplate="footer">
    <div class="flex gap-2 justify-content-end p-3">
      <button pButton label="Cancelar" class="p-button-text"></button>
      <button pButton label="Confirmar"></button>
    </div>
  </ng-template>
</p-card>
```

### Inputs

```html
<!-- Input Text -->
<div class="field">
  <label for="username">Nome de Usuário</label>
  <input 
    id="username"
    pInputText 
    type="text"
    class="w-full"
    placeholder="Digite o nome"
  />
</div>

<!-- Input com Ícone -->
<span class="p-input-icon-left w-full">
  <i class="pi pi-search"></i>
  <input 
    pInputText 
    type="text" 
    placeholder="Buscar..."
    class="w-full"
  />
</span>

<!-- Password -->
<p-password 
  [(ngModel)]="password"
  [toggleMask]="true"
  styleClass="w-full"
></p-password>
```

### Tabelas (Futuro)

```html
<p-table 
  [value]="orders" 
  [paginator]="true" 
  [rows]="10"
  [responsive]="true"
  styleClass="p-datatable-striped"
>
  <ng-template pTemplate="header">
    <tr>
      <th>ID</th>
      <th>Cliente</th>
      <th>Status</th>
      <th>Total</th>
      <th>Ações</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-order>
    <tr>
      <td>{{ order.id }}</td>
      <td>{{ order.customerName }}</td>
      <td>
        <span class="badge" [ngClass]="getStatusClass(order.status)">
          {{ order.status }}
        </span>
      </td>
      <td>{{ order.total | currency:'BRL' }}</td>
      <td>
        <button 
          pButton 
          icon="pi pi-pencil" 
          class="p-button-text"
        ></button>
      </td>
    </tr>
  </ng-template>
</p-table>
```

## 🎨 Utilitários PrimeFlex

### Flexbox

```html
<!-- Container Flex -->
<div class="flex align-items-center justify-content-between">
  <span>Texto à esquerda</span>
  <button pButton label="Direita"></button>
</div>

<!-- Flex Column -->
<div class="flex flex-column gap-3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Flex Wrap -->
<div class="flex flex-wrap gap-2">
  <span class="badge">Tag 1</span>
  <span class="badge">Tag 2</span>
</div>
```

### Classes de Utilitários Comuns

```html
<!-- Largura -->
<div class="w-full">100% width</div>
<div class="w-6">50% width</div>
<div class="w-4">33.33% width</div>

<!-- Altura -->
<div class="h-full">100% height</div>
<div class="h-screen">100vh height</div>

<!-- Display -->
<div class="hidden md:block">Visível apenas no desktop</div>
<div class="block md:hidden">Visível apenas no mobile</div>

<!-- Texto -->
<p class="text-center">Centralizado</p>
<p class="text-right">Direita</p>
<p class="font-bold">Negrito</p>
<p class="text-primary">Cor primária</p>

<!-- Background -->
<div class="bg-primary text-white p-3">Fundo primário</div>
<div class="surface-card p-4">Fundo card</div>

<!-- Bordas -->
<div class="border-1 border-round p-3">Com borda</div>
<div class="border-round-lg">Borda arredondada</div>

<!-- Sombras -->
<div class="shadow-1">Sombra pequena</div>
<div class="shadow-2">Sombra média</div>
<div class="shadow-3">Sombra grande</div>
```

## 📱 Responsividade

### Padrão Mobile-First

```html
<!-- Sempre começar com mobile -->
<div class="col-12 md:col-6 lg:col-4">
  <!-- 100% no mobile, 50% no tablet, 33% no desktop -->
</div>

<!-- Ocultar/Mostrar baseado em tela -->
<div class="hidden lg:block">
  <!-- Visível apenas em desktop -->
</div>

<div class="block lg:hidden">
  <!-- Visível apenas em mobile/tablet -->
</div>
```

### Espaçamento Responsivo

```html
<!-- Padding adaptativo -->
<div class="p-2 md:p-4 lg:p-6">
  <!-- 8px mobile, 16px tablet, 24px desktop -->
</div>

<!-- Margin adaptativo -->
<div class="mt-3 md:mt-4 lg:mt-5">
  <!-- 12px mobile, 16px tablet, 24px desktop -->
</div>
```

## 🎨 SCSS nos Componentes

### Estrutura SCSS de um Componente

```scss
// nome-componente.component.scss

// 1. Variáveis locais (se necessário)
$card-spacing: 1rem;
$mobile-breakpoint: 768px;

// 2. Container principal
:host {
  display: block;
  
  // 3. Estilos do componente
  .component-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $card-spacing;
    
    h1 {
      margin: 0;
      color: var(--text-color);
      font-weight: 600;
    }
  }

  // 4. Modificadores
  .card-container {
    &.loading {
      opacity: 0.6;
      pointer-events: none;
    }
    
    &.empty {
      text-align: center;
      color: var(--text-color-secondary);
    }
  }

  // 5. Media queries
  @media (max-width: $mobile-breakpoint) {
    .component-header {
      flex-direction: column;
      gap: 1rem;
    }
  }
}
```

### Variáveis Globais (styles.scss)

```scss
// src/styles.scss

// Importações
@import 'primeicons/primeicons.css';
@import 'primeflex/primeflex.css';
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

// Variáveis globais
:root {
  --primary-color: #3B82F6;
  --surface-ground: #f8fafc;
  --text-color: #1e293b;
  --text-color-secondary: #64748b;
}

// Reset
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--surface-ground);
  color: var(--text-color);
  line-height: 1.6;
}

// Scrollbar customizada
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
  
  &:hover {
    background: #94a3b8;
  }
}

// Classes utilitárias customizadas
.full-height {
  height: 100vh;
}

.card-shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
```

## 🎨 Badges e Status

```html
<!-- Badges de Status -->
<span class="badge bg-green-500 text-white">Ativo</span>
<span class="badge bg-red-500 text-white">Inativo</span>
<span class="badge bg-yellow-500 text-white">Pendente</span>
<span class="badge bg-blue-500 text-white">Em Análise</span>

<!-- Badge com Ícone -->
<span class="badge bg-primary">
  <i class="pi pi-check mr-1"></i>
  Concluído
</span>
```

### CSS para Badges Customizados

```scss
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  
  &.badge-sm {
    padding: 0.125rem 0.5rem;
    font-size: 0.625rem;
  }
  
  &.badge-lg {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
```

## ✅ Checklist de Estilos

Antes de commitar, verifique:

- [ ] Usa classes PrimeFlex quando possível
- [ ] Responsivo em mobile, tablet e desktop
- [ ] Espaçamentos consistentes (múltiplos de 4px)
- [ ] Cores do tema (variáveis CSS)
- [ ] Fonte Poppins aplicada
- [ ] Sem inline styles no template
- [ ] SCSS organizado e comentado
- [ ] Sem !important (exceto casos extremos)
- [ ] Acessibilidade (contraste, tamanho de fonte)

## 🚫 Anti-Patterns

```scss
// ❌ Evitar
.my-component {
  // Não use px fixos para tudo
  width: 450px;
  
  // Não use cores hardcoded
  color: #333333;
  
  // Não use !important sem necessidade
  margin: 10px !important;
}

// ✅ Preferir
.my-component {
  // Use % ou rem
  width: 100%;
  max-width: 28rem;
  
  // Use variáveis CSS
  color: var(--text-color);
  
  // Seja específico ao invés de !important
  margin: 0.625rem;
}
```
