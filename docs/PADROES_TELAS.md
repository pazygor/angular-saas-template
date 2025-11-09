# 🎯 Padrões de Telas (Pages)

## Anatomia de uma Tela

Toda tela no ClimbDelivery segue uma estrutura consistente para manter uniformidade visual e experiência do usuário.

### Estrutura Base

```
┌─────────────────────────────────────────────────┐
│  Header da Página                               │
│  (Título + Ações)                               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Filtros/Busca (opcional)                       │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Conteúdo Principal                             │
│  (Cards, Tabelas, Kanban, etc)                  │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 📋 Template Padrão de Tela

### HTML

```html
<!-- Container principal com padding responsivo -->
<div class="p-4 md:p-6">
  
  <!-- SEÇÃO 1: HEADER DA PÁGINA -->
  <div class="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between mb-4 gap-3">
    <!-- Título e Subtítulo -->
    <div>
      <h1 class="text-3xl font-semibold m-0 mb-2">Título da Página</h1>
      <p class="text-secondary m-0">Descrição opcional da página</p>
    </div>
    
    <!-- Ações Principais -->
    <div class="flex gap-2">
      <button 
        pButton 
        label="Ação Secundária"
        icon="pi pi-download"
        class="p-button-outlined"
      ></button>
      <button 
        pButton 
        label="Nova Ação"
        icon="pi pi-plus"
      ></button>
    </div>
  </div>

  <!-- SEÇÃO 2: FILTROS/BUSCA (Opcional) -->
  <div class="grid mb-4">
    <div class="col-12 md:col-6 lg:col-4">
      <span class="p-input-icon-left w-full">
        <i class="pi pi-search"></i>
        <input 
          pInputText 
          type="text"
          placeholder="Buscar..."
          class="w-full"
        />
      </span>
    </div>
    <div class="col-12 md:col-6 lg:col-4">
      <!-- Outros filtros -->
    </div>
  </div>

  <!-- SEÇÃO 3: CONTEÚDO PRINCIPAL -->
  <div class="grid">
    <div class="col-12">
      <p-card>
        <!-- Conteúdo aqui -->
      </p-card>
    </div>
  </div>

</div>
```

### TypeScript

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Services e Models
import { DataService } from '../../../core/services/data.service';
import { DataModel } from '../../../core/models/data.model';

@Component({
  selector: 'app-nome-tela',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './nome-tela.component.html',
  styleUrl: './nome-tela.component.scss'
})
export class NomeTelaComponent implements OnInit, OnDestroy {
  // Estado
  loading = false;
  data: DataModel[] = [];
  searchTerm = '';

  // Controle de subscriptions
  private destroyed$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  loadData(): void {
    this.loading = true;
    
    this.dataService.getData()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (data) => {
          this.data = data;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar dados'
          });
          this.loading = false;
        }
      });
  }

  handleAction(): void {
    // Implementação
  }
}
```

## 🎨 Tipos de Layout de Tela

### 1. Layout de Lista (Cards em Grid)

**Exemplo: Dashboard > Menu**

```html
<div class="p-4 md:p-6">
  <div class="flex align-items-center justify-content-between mb-4">
    <h1 class="text-3xl font-semibold m-0">Cardápio</h1>
    <button pButton label="Novo Item" icon="pi pi-plus"></button>
  </div>

  <!-- Grid de Cards -->
  <div class="grid">
    <div class="col-12 md:col-6 lg:col-4" *ngFor="let item of items">
      <p-card>
        <ng-template pTemplate="header">
          <img [src]="item.image" alt="item.name" class="w-full" />
        </ng-template>
        
        <h3 class="mt-0">{{ item.name }}</h3>
        <p class="text-secondary">{{ item.description }}</p>
        <p class="text-2xl font-bold text-primary">
          {{ item.price | currency:'BRL' }}
        </p>
        
        <ng-template pTemplate="footer">
          <div class="flex gap-2">
            <button pButton icon="pi pi-pencil" class="flex-1"></button>
            <button pButton icon="pi pi-trash" class="flex-1 p-button-danger"></button>
          </div>
        </ng-template>
      </p-card>
    </div>
  </div>

  <!-- Estado Vazio -->
  <div *ngIf="items.length === 0" class="text-center py-8">
    <i class="pi pi-inbox text-6xl text-400 mb-4"></i>
    <p class="text-secondary text-xl">Nenhum item cadastrado</p>
    <button pButton label="Adicionar Primeiro Item" class="mt-3"></button>
  </div>
</div>
```

### 2. Layout Kanban (Colunas)

**Exemplo: Dashboard > Pedidos**

```html
<div class="p-4 md:p-6">
  <div class="flex align-items-center justify-content-between mb-4">
    <h1 class="text-3xl font-semibold m-0">Meus Pedidos</h1>
    <button pButton label="Novo Pedido" icon="pi pi-plus"></button>
  </div>

  <!-- Colunas do Kanban -->
  <div class="grid">
    <div class="col-12 md:col-4" *ngFor="let column of columns">
      <div class="surface-card border-round p-3">
        <!-- Header da Coluna -->
        <div class="flex align-items-center justify-content-between mb-3">
          <h3 class="m-0">{{ column.title }}</h3>
          <span class="badge bg-primary">
            {{ ordersByColumn[column.title]?.length || 0 }}
          </span>
        </div>

        <!-- Cards da Coluna -->
        <div class="flex flex-column gap-3">
          <div 
            *ngFor="let order of ordersByColumn[column.title]"
            class="surface-ground border-round p-3 cursor-pointer hover:surface-hover"
          >
            <div class="flex justify-content-between align-items-start mb-2">
              <span class="font-semibold">#{{ order.id }}</span>
              <span class="text-xs text-secondary">{{ order.time }}</span>
            </div>
            
            <p class="text-secondary text-sm m-0 mb-2">{{ order.customerName }}</p>
            
            <div class="flex justify-content-between align-items-center">
              <span class="text-primary font-bold">
                {{ order.total | currency:'BRL' }}
              </span>
              <button 
                pButton 
                icon="pi pi-arrow-right"
                class="p-button-rounded p-button-text p-button-sm"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 3. Layout de Formulário

**Exemplo: Dashboard > Configurações**

```html
<div class="p-4 md:p-6">
  <h1 class="text-3xl font-semibold mb-4">Configurações</h1>

  <div class="grid">
    <!-- Formulário Principal -->
    <div class="col-12 lg:col-8">
      <p-card header="Informações Gerais">
        <form [formGroup]="settingsForm" (ngSubmit)="save()">
          
          <!-- Campo 1 -->
          <div class="field mb-4">
            <label for="storeName" class="font-semibold mb-2 block">
              Nome da Loja
            </label>
            <input 
              id="storeName"
              pInputText 
              formControlName="storeName"
              class="w-full"
              placeholder="Digite o nome da loja"
            />
            <small 
              class="p-error block mt-1"
              *ngIf="settingsForm.get('storeName')?.invalid && settingsForm.get('storeName')?.touched"
            >
              Nome da loja é obrigatório
            </small>
          </div>

          <!-- Campo 2 -->
          <div class="field mb-4">
            <label for="email" class="font-semibold mb-2 block">
              E-mail
            </label>
            <input 
              id="email"
              pInputText 
              type="email"
              formControlName="email"
              class="w-full"
            />
          </div>

          <!-- Botões -->
          <div class="flex gap-2 justify-content-end mt-4">
            <button 
              pButton 
              label="Cancelar"
              type="button"
              class="p-button-outlined"
            ></button>
            <button 
              pButton 
              label="Salvar Alterações"
              type="submit"
              [loading]="loading"
              [disabled]="settingsForm.invalid"
            ></button>
          </div>

        </form>
      </p-card>
    </div>

    <!-- Sidebar Informações -->
    <div class="col-12 lg:col-4">
      <p-card header="Ajuda">
        <p class="text-secondary text-sm">
          Configure as informações básicas da sua loja aqui.
        </p>
      </p-card>
    </div>
  </div>
</div>
```

### 4. Layout de Dashboard (Estatísticas)

**Exemplo: Dashboard > Relatórios**

```html
<div class="p-4 md:p-6">
  <h1 class="text-3xl font-semibold mb-4">Relatórios</h1>

  <!-- Cards de Estatísticas -->
  <div class="grid mb-4">
    <div class="col-12 md:col-6 lg:col-3" *ngFor="let stat of statistics">
      <div class="surface-card border-round p-4">
        <div class="flex align-items-center justify-content-between mb-3">
          <span class="text-secondary text-sm">{{ stat.label }}</span>
          <i [class]="stat.icon + ' text-2xl text-primary'"></i>
        </div>
        <div class="text-3xl font-bold mb-2">{{ stat.value }}</div>
        <div class="flex align-items-center">
          <i 
            [class]="stat.trend === 'up' ? 'pi pi-arrow-up text-green-500' : 'pi pi-arrow-down text-red-500'"
          ></i>
          <span 
            [class]="stat.trend === 'up' ? 'text-green-500' : 'text-red-500'"
            class="ml-2 text-sm font-semibold"
          >
            {{ stat.percentage }}%
          </span>
          <span class="text-secondary text-sm ml-2">vs. mês anterior</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Gráficos (Placeholder) -->
  <div class="grid">
    <div class="col-12 lg:col-8">
      <p-card header="Vendas por Período">
        <div class="h-20rem flex align-items-center justify-content-center text-secondary">
          Gráfico de vendas (integração futura)
        </div>
      </p-card>
    </div>
    <div class="col-12 lg:col-4">
      <p-card header="Top Produtos">
        <div class="flex flex-column gap-3">
          <div *ngFor="let product of topProducts" class="flex justify-content-between">
            <span>{{ product.name }}</span>
            <span class="font-semibold">{{ product.sales }}</span>
          </div>
        </div>
      </p-card>
    </div>
  </div>
</div>
```

### 5. Layout de Perfil/Conta

**Exemplo: Dashboard > Conta**

```html
<div class="p-4 md:p-6">
  <h1 class="text-3xl font-semibold mb-4">Minha Conta</h1>

  <div class="grid">
    <!-- Card de Perfil -->
    <div class="col-12 md:col-4">
      <div class="surface-card p-4 border-round shadow-2 text-center">
        <!-- Avatar -->
        <div class="mb-3">
          <div class="inline-flex align-items-center justify-content-center border-circle bg-primary" 
               style="width: 100px; height: 100px;">
            <span class="text-4xl font-bold text-white">
              {{ (currentUser?.name?.substring(0, 2)?.toUpperCase()) || 'U' }}
            </span>
          </div>
        </div>
        
        <!-- Informações -->
        <h3 class="mt-0 mb-2">{{ currentUser?.name }}</h3>
        <p class="text-secondary text-sm m-0 mb-3">{{ currentUser?.email }}</p>
        
        <!-- Ações -->
        <button pButton label="Alterar Foto" class="w-full mb-2"></button>
        <button pButton label="Sair" class="w-full p-button-outlined p-button-danger"></button>
      </div>
    </div>

    <!-- Formulário de Dados -->
    <div class="col-12 md:col-8">
      <p-card header="Informações Pessoais" class="mb-4">
        <!-- Campos do formulário -->
      </p-card>

      <p-card header="Segurança">
        <!-- Campos de senha -->
      </p-card>
    </div>
  </div>
</div>
```

## 🎨 Componentes Comuns de Tela

### Loading State

```html
<!-- Loading Overlay -->
<div *ngIf="loading" class="flex align-items-center justify-content-center p-8">
  <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
</div>

<!-- Skeleton (melhor UX) -->
<div *ngIf="loading" class="grid">
  <div class="col-12 md:col-6 lg:col-4" *ngFor="let item of [1,2,3,4,5,6]">
    <p-card>
      <div class="surface-200 border-round h-10rem mb-3"></div>
      <div class="surface-200 border-round h-2rem mb-2"></div>
      <div class="surface-200 border-round h-1rem w-6"></div>
    </p-card>
  </div>
</div>
```

### Empty State

```html
<div *ngIf="!loading && items.length === 0" class="text-center py-8">
  <i class="pi pi-inbox text-6xl text-400 mb-4"></i>
  <h3 class="text-xl font-semibold mb-2">Nenhum item encontrado</h3>
  <p class="text-secondary mb-4">Comece criando seu primeiro item</p>
  <button pButton label="Criar Primeiro Item" icon="pi pi-plus"></button>
</div>
```

### Error State

```html
<div *ngIf="error" class="text-center py-8">
  <i class="pi pi-exclamation-triangle text-6xl text-red-500 mb-4"></i>
  <h3 class="text-xl font-semibold mb-2">Ops! Algo deu errado</h3>
  <p class="text-secondary mb-4">{{ error.message }}</p>
  <button pButton label="Tentar Novamente" icon="pi pi-refresh" (onClick)="retry()"></button>
</div>
```

### Toast Messages

```typescript
// No component
constructor(private messageService: MessageService) {}

// Sucesso
this.messageService.add({
  severity: 'success',
  summary: 'Sucesso',
  detail: 'Operação realizada com sucesso'
});

// Erro
this.messageService.add({
  severity: 'error',
  summary: 'Erro',
  detail: 'Falha ao realizar operação'
});

// Aviso
this.messageService.add({
  severity: 'warn',
  summary: 'Atenção',
  detail: 'Você tem ações pendentes'
});

// Info
this.messageService.add({
  severity: 'info',
  summary: 'Informação',
  detail: 'Novos dados disponíveis'
});
```

## ✅ Checklist de Tela

Antes de considerar uma tela completa:

- [ ] Header com título e ações principais
- [ ] Layout responsivo (mobile, tablet, desktop)
- [ ] Loading state (skeleton ou spinner)
- [ ] Empty state (quando não há dados)
- [ ] Error state (quando falha)
- [ ] Toast messages para feedback
- [ ] Formulários com validação
- [ ] Confirmação em ações destrutivas
- [ ] Breadcrumbs (se necessário)
- [ ] Acessibilidade (labels, contraste, navegação)

## 🎯 Boas Práticas

### ✅ Fazer
- Manter consistência visual entre telas
- Usar componentes PrimeNG sempre que possível
- Feedback visual para todas as ações
- Loading states para operações assíncronas
- Empty states amigáveis
- Mensagens de erro claras e acionáveis

### ❌ Evitar
- Textos longos e sem hierarquia
- Botões sem ícones (menos intuitivos)
- Falta de feedback ao usuário
- Layouts quebrados em mobile
- Muitas informações em uma única tela
- Ações destrutivas sem confirmação
