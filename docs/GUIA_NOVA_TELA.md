# 🚀 Guia: Criar uma Nova Tela

Passo a passo para criar uma nova tela no ClimbDelivery mantendo o padrão estabelecido.

## 📋 Checklist Rápido

- [ ] Definir rota e nome do componente
- [ ] Gerar componente com CLI
- [ ] Criar model/interface (se necessário)
- [ ] Criar/adaptar service
- [ ] Configurar rota com lazy loading
- [ ] Adicionar item no menu do sidebar
- [ ] Implementar layout (list/kanban/form/dashboard/profile)
- [ ] Adicionar estados (loading/empty/error)
- [ ] Estilizar com PrimeFlex e PrimeNG
- [ ] Testar responsividade
- [ ] Validar guard de autenticação

## 🎯 Exemplo Prático: Tela de Clientes

Vamos criar uma tela de listagem de clientes.

---

## Passo 1: Planejar Estrutura

**Rota desejada:** `/dashboard/clientes`

**Estrutura:**
```
src/app/features/clientes/
├── pages/
│   └── clientes-list/
│       ├── clientes-list.component.ts
│       ├── clientes-list.component.html
│       └── clientes-list.component.scss
├── components/
│   └── cliente-card/
│       ├── cliente-card.component.ts
│       ├── cliente-card.component.html
│       └── cliente-card.component.scss
├── models/
│   └── cliente.model.ts
└── clientes.routes.ts
```

---

## Passo 2: Criar Model

**Caminho:** `src/app/features/clientes/models/cliente.model.ts`

```bash
# PowerShell
New-Item -ItemType Directory -Force -Path "src\app\features\clientes\models"
```

```typescript
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: Endereco;
  dataCadastro: Date;
  ativo: boolean;
}

export interface Endereco {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface ClienteCreateDto {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: Endereco;
}

export interface ClienteUpdateDto extends Partial<ClienteCreateDto> {
  id: string;
}
```

---

## Passo 3: Criar Service

**Caminho:** `src/app/core/services/cliente.service.ts`

```bash
# PowerShell - Gerar service
ng generate service core/services/cliente --skip-tests
```

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Cliente, ClienteCreateDto, ClienteUpdateDto } from '../../features/clientes/models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:3000/api/clientes';

  // Estado reativo
  private clientesSubject = new BehaviorSubject<Cliente[]>([]);
  public clientes$ = this.clientesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // GET - Todos
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl).pipe(
      tap(clientes => this.clientesSubject.next(clientes)),
      catchError(error => {
        console.error('Erro ao buscar clientes:', error);
        throw error;
      })
    );
  }

  // GET - Por ID
  getClienteById(id: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // POST - Criar
  createCliente(cliente: ClienteCreateDto): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente).pipe(
      tap(newCliente => {
        const current = this.clientesSubject.value;
        this.clientesSubject.next([...current, newCliente]);
      })
    );
  }

  // PUT - Atualizar
  updateCliente(id: string, cliente: ClienteUpdateDto): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente).pipe(
      tap(updatedCliente => {
        const current = this.clientesSubject.value;
        const index = current.findIndex(c => c.id === id);
        if (index !== -1) {
          current[index] = updatedCliente;
          this.clientesSubject.next([...current]);
        }
      })
    );
  }

  // DELETE
  deleteCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.clientesSubject.value;
        this.clientesSubject.next(current.filter(c => c.id !== id));
      })
    );
  }
}
```

---

## Passo 4: Gerar Componentes

### 4.1 Componente de Página (Smart Component)

```bash
# PowerShell
ng generate component features/clientes/pages/clientes-list --skip-tests
```

**clientes-list.component.ts**

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

// Models & Services
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../../../core/services/cliente.service';

// Components
import { ClienteCardComponent } from '../../components/cliente-card/cliente-card.component';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    ClienteCardComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss']
})
export class ClientesListComponent implements OnInit, OnDestroy {
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private clienteService: ClienteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClientes(): void {
    this.isLoading = true;

    this.clienteService.getClientes()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (clientes) => {
          this.clientes = clientes;
          this.filteredClientes = clientes;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar clientes'
          });
        }
      });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredClientes = this.clientes;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredClientes = this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(term) ||
      cliente.email.toLowerCase().includes(term) ||
      cliente.telefone.includes(term)
    );
  }

  onAdd(): void {
    this.router.navigate(['/dashboard/clientes/novo']);
  }

  onEdit(cliente: Cliente): void {
    this.router.navigate(['/dashboard/clientes', cliente.id, 'editar']);
  }

  onDelete(cliente: Cliente): void {
    this.confirmationService.confirm({
      message: `Deseja realmente excluir o cliente ${cliente.nome}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.clienteService.deleteCliente(cliente.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Cliente excluído com sucesso'
              });
              this.loadClientes();
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao excluir cliente'
              });
            }
          });
      }
    });
  }
}
```

**clientes-list.component.html**

```html
<div class="clientes-list">
  <!-- Header -->
  <div class="flex justify-content-between align-items-center mb-4">
    <h2 class="text-3xl font-semibold m-0">Clientes</h2>
    <button 
      pButton 
      label="Novo Cliente" 
      icon="pi pi-plus" 
      (click)="onAdd()">
    </button>
  </div>

  <!-- Barra de Busca -->
  <div class="mb-4">
    <span class="p-input-icon-left w-full md:w-6">
      <i class="pi pi-search"></i>
      <input 
        type="text" 
        pInputText 
        placeholder="Buscar por nome, email ou telefone"
        [(ngModel)]="searchTerm"
        (input)="onSearch()"
        class="w-full" />
    </span>
  </div>

  <!-- Loading State -->
  <div *ngIf="isLoading" class="flex justify-content-center align-items-center py-8">
    <i class="pi pi-spin pi-spinner" style="font-size: 3rem; color: var(--primary-color);"></i>
  </div>

  <!-- Empty State -->
  <div *ngIf="!isLoading && filteredClientes.length === 0" class="text-center py-8">
    <i class="pi pi-users" style="font-size: 4rem; color: var(--text-color-secondary);"></i>
    <p class="text-xl text-color-secondary mt-3">Nenhum cliente encontrado</p>
    <button 
      pButton 
      label="Adicionar Primeiro Cliente" 
      icon="pi pi-plus" 
      class="mt-3"
      (click)="onAdd()">
    </button>
  </div>

  <!-- Grid de Clientes -->
  <div *ngIf="!isLoading && filteredClientes.length > 0" 
       class="grid">
    <div *ngFor="let cliente of filteredClientes" 
         class="col-12 md:col-6 lg:col-4">
      <app-cliente-card
        [cliente]="cliente"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)">
      </app-cliente-card>
    </div>
  </div>
</div>

<!-- Toast para mensagens -->
<p-toast></p-toast>

<!-- Dialog de confirmação -->
<p-confirmDialog></p-confirmDialog>
```

**clientes-list.component.scss**

```scss
:host {
  display: block;
  padding: 1.5rem;
}

.clientes-list {
  max-width: 1400px;
  margin: 0 auto;
}
```

### 4.2 Componente Card (Dumb Component)

```bash
# PowerShell
ng generate component features/clientes/components/cliente-card --skip-tests
```

**cliente-card.component.ts**

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

// Models
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-cliente-card',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule
  ],
  templateUrl: './cliente-card.component.html',
  styleUrls: ['./cliente-card.component.scss']
})
export class ClienteCardComponent {
  @Input({ required: true }) cliente!: Cliente;
  @Output() edit = new EventEmitter<Cliente>();
  @Output() delete = new EventEmitter<Cliente>();

  onEdit(): void {
    this.edit.emit(this.cliente);
  }

  onDelete(): void {
    this.delete.emit(this.cliente);
  }
}
```

**cliente-card.component.html**

```html
<p-card>
  <ng-template pTemplate="header">
    <div class="flex justify-content-between align-items-center p-3">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-user text-2xl" [style.color]="'var(--primary-color)'"></i>
        <span class="font-semibold text-xl">{{ cliente.nome }}</span>
      </div>
      <p-tag 
        [value]="cliente.ativo ? 'Ativo' : 'Inativo'"
        [severity]="cliente.ativo ? 'success' : 'danger'">
      </p-tag>
    </div>
  </ng-template>

  <div class="flex flex-column gap-2">
    <div class="flex align-items-center gap-2">
      <i class="pi pi-envelope text-color-secondary"></i>
      <span class="text-sm">{{ cliente.email }}</span>
    </div>

    <div class="flex align-items-center gap-2">
      <i class="pi pi-phone text-color-secondary"></i>
      <span class="text-sm">{{ cliente.telefone }}</span>
    </div>

    <div class="flex align-items-center gap-2">
      <i class="pi pi-id-card text-color-secondary"></i>
      <span class="text-sm">{{ cliente.cpf }}</span>
    </div>

    <div class="flex align-items-center gap-2">
      <i class="pi pi-map-marker text-color-secondary"></i>
      <span class="text-sm">
        {{ cliente.endereco.cidade }} - {{ cliente.endereco.estado }}
      </span>
    </div>
  </div>

  <ng-template pTemplate="footer">
    <div class="flex gap-2 justify-content-end">
      <button 
        pButton 
        label="Editar" 
        icon="pi pi-pencil" 
        class="p-button-text p-button-sm"
        (click)="onEdit()">
      </button>
      <button 
        pButton 
        label="Excluir" 
        icon="pi pi-trash" 
        class="p-button-text p-button-danger p-button-sm"
        (click)="onDelete()">
      </button>
    </div>
  </ng-template>
</p-card>
```

**cliente-card.component.scss**

```scss
:host {
  display: block;
  height: 100%;

  ::ng-deep .p-card {
    height: 100%;
    display: flex;
    flex-direction: column;

    .p-card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .p-card-content {
      flex: 1;
    }
  }
}
```

---

## Passo 5: Configurar Rotas

**Caminho:** `src/app/features/clientes/clientes.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const clientesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/clientes-list/clientes-list.component')
      .then(m => m.ClientesListComponent)
  },
  {
    path: 'novo',
    loadComponent: () => import('./pages/cliente-form/cliente-form.component')
      .then(m => m.ClienteFormComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./pages/cliente-form/cliente-form.component')
      .then(m => m.ClienteFormComponent)
  }
];
```

**Adicionar em:** `src/app/features/dashboard/dashboard.routes.ts`

```typescript
import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  // ... outras rotas
  {
    path: 'clientes',
    loadChildren: () => import('../clientes/clientes.routes')
      .then(m => m.clientesRoutes)
  }
];
```

---

## Passo 6: Adicionar no Menu

**Editar:** `src/app/layout/components/sidebar/sidebar.component.ts`

```typescript
menuItems: MenuItem[] = [
  // ... outros itens
  {
    label: 'Clientes',
    icon: 'pi pi-users',
    routerLink: '/dashboard/clientes'
  }
];
```

---

## Passo 7: Testar

```bash
# PowerShell - Iniciar servidor
ng serve
```

Acesse: `http://localhost:4200/dashboard/clientes`

---

## 🎨 Customização por Tipo de Layout

### Layout Grid/Cards (usado acima)
✅ Bom para: Listagens com cards visuais (clientes, produtos, restaurantes)

### Layout Tabela
✅ Bom para: Dados tabulares (relatórios, transações)

```html
<p-table [value]="clientes" [loading]="isLoading">
  <ng-template pTemplate="header">
    <tr>
      <th>Nome</th>
      <th>Email</th>
      <th>Telefone</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-cliente>
    <tr>
      <td>{{ cliente.nome }}</td>
      <td>{{ cliente.email }}</td>
      <td>{{ cliente.telefone }}</td>
      <td>
        <p-tag [value]="cliente.ativo ? 'Ativo' : 'Inativo'"></p-tag>
      </td>
      <td>
        <button pButton icon="pi pi-pencil" (click)="onEdit(cliente)"></button>
      </td>
    </tr>
  </ng-template>
</p-table>
```

### Layout Form (2 colunas)
✅ Bom para: Formulários de cadastro/edição

Ver `PADROES_TELAS.md` seção "Layout 3: Formulário"

### Layout Kanban
✅ Bom para: Gestão de fluxo (pedidos, tarefas, leads)

Ver `PADROES_TELAS.md` seção "Layout 2: Kanban"

---

## ✅ Checklist Final

### Funcionalidade
- [ ] CRUD completo funcionando
- [ ] Loading states implementados
- [ ] Empty states implementados
- [ ] Error handling com toast
- [ ] Confirmação de deleção
- [ ] Busca/filtro funcional

### UI/UX
- [ ] Responsivo (mobile/tablet/desktop)
- [ ] Ícones apropriados
- [ ] Cores do tema aplicadas
- [ ] Espaçamentos consistentes (PrimeFlex)
- [ ] Feedback visual (hover, active)

### Código
- [ ] Standalone component
- [ ] Unsubscribe com takeUntil
- [ ] Tipos explícitos (sem any)
- [ ] Imports organizados
- [ ] Comentários onde necessário
- [ ] Nomenclatura consistente

### Integração
- [ ] Rota configurada com lazy loading
- [ ] Item no menu sidebar
- [ ] Guard de autenticação aplicado
- [ ] Service criado/adaptado
- [ ] Models definidos

---

## 🚨 Problemas Comuns

### 1. Erro: "Cannot find module"
**Solução:** Verifique o caminho do import e se o arquivo existe

### 2. Erro: "NG0304: 'X' is not a known element"
**Solução:** Importe o módulo PrimeNG correspondente no imports do component

### 3. Layout quebrado no mobile
**Solução:** Use classes PrimeFlex responsivas: `col-12 md:col-6 lg:col-4`

### 4. Rota não funciona
**Solução:** Verifique se a rota foi adicionada ao dashboard.routes.ts

### 5. Dados não carregam
**Solução:** Verifique console do navegador, service e URL da API

---

## 📚 Referências

- [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md) - Organização de pastas
- [PADROES_COMPONENTES.md](./PADROES_COMPONENTES.md) - Como criar componentes
- [PADROES_TELAS.md](./PADROES_TELAS.md) - Layouts de tela
- [PADROES_SERVICOS.md](./PADROES_SERVICOS.md) - Como criar services
- [PADROES_ROTEAMENTO.md](./PADROES_ROTEAMENTO.md) - Configurar rotas
