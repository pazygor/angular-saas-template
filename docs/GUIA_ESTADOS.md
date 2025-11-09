# 🎛️ Guia: Gerenciamento de Estados

Padrões para gerenciar estados (loading, error, success, empty) e feedback ao usuário.

## 🎯 Tipos de Estados

### 1. Loading (Carregando)
Estado temporário durante operações assíncronas

### 2. Success (Sucesso)
Operação concluída com êxito

### 3. Error (Erro)
Falha na operação

### 4. Empty (Vazio)
Sem dados para exibir

### 5. Idle (Inicial)
Estado padrão antes de qualquer ação

## 📦 Estrutura de Estado

### State Interface

```typescript
// shared/models/state.model.ts
export interface DataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
}

export const initialState = <T>(): DataState<T> => ({
  data: null,
  isLoading: false,
  error: null,
  isEmpty: false
});
```

## 🔄 Pattern 1: BehaviorSubject (Simples)

Ideal para estados simples sem necessidade de biblioteca externa.

### Component

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil, finalize } from 'rxjs';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html'
})
export class PedidosComponent implements OnInit, OnDestroy {
  // Estados individuais
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  pedidos$ = new BehaviorSubject<Pedido[]>([]);

  // Computed
  get isEmpty(): boolean {
    return !this.isLoading$.value && 
           this.pedidos$.value.length === 0 && 
           !this.error$.value;
  }

  private destroy$ = new Subject<void>();

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPedidos(): void {
    this.isLoading$.next(true);
    this.error$.next(null);

    this.pedidoService.getPedidos()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading$.next(false))
      )
      .subscribe({
        next: (pedidos) => {
          this.pedidos$.next(pedidos);
        },
        error: (error) => {
          this.error$.next('Falha ao carregar pedidos');
          console.error(error);
        }
      });
  }

  retry(): void {
    this.loadPedidos();
  }
}
```

### Template

```html
<!-- Loading State -->
<div *ngIf="isLoading$ | async" class="loading-container">
  <i class="pi pi-spin pi-spinner" style="font-size: 3rem;"></i>
  <p class="mt-3">Carregando pedidos...</p>
</div>

<!-- Error State -->
<div *ngIf="error$ | async as errorMsg" class="error-container">
  <i class="pi pi-exclamation-triangle" style="font-size: 3rem; color: var(--red-500);"></i>
  <p class="text-xl mt-3">{{ errorMsg }}</p>
  <button pButton label="Tentar Novamente" icon="pi pi-refresh" (click)="retry()"></button>
</div>

<!-- Empty State -->
<div *ngIf="isEmpty" class="empty-container">
  <i class="pi pi-inbox" style="font-size: 3rem; color: var(--text-color-secondary);"></i>
  <p class="text-xl mt-3">Nenhum pedido encontrado</p>
</div>

<!-- Data State -->
<div *ngIf="(pedidos$ | async) as pedidos">
  <div *ngFor="let pedido of pedidos">
    <!-- Render pedido -->
  </div>
</div>
```

## 🔄 Pattern 2: Estado Unificado (Recomendado)

Centraliza todos os estados em um único objeto.

### State Service

```typescript
// shared/services/state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  loaded: boolean;
}

@Injectable()
export class StateService<T> {
  private state$ = new BehaviorSubject<AppState<T>>({
    data: null,
    loading: false,
    error: null,
    loaded: false
  });

  public getState(): Observable<AppState<T>> {
    return this.state$.asObservable();
  }

  public setLoading(): void {
    this.state$.next({
      ...this.state$.value,
      loading: true,
      error: null
    });
  }

  public setData(data: T): void {
    this.state$.next({
      data,
      loading: false,
      error: null,
      loaded: true
    });
  }

  public setError(error: string): void {
    this.state$.next({
      ...this.state$.value,
      loading: false,
      error,
      loaded: true
    });
  }

  public reset(): void {
    this.state$.next({
      data: null,
      loading: false,
      error: null,
      loaded: false
    });
  }
}
```

### Component com StateService

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, finalize } from 'rxjs';
import { StateService } from '../../../../shared/services/state.service';
import { Order } from '../../models/order.model';
import { OrderService } from '../../../../core/services/order.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  providers: [StateService] // Instância por componente
})
export class OrdersListComponent implements OnInit, OnDestroy {
  state$ = this.stateService.getState();

  private destroy$ = new Subject<void>();

  constructor(
    private stateService: StateService<Order[]>,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.stateService.setLoading();

    this.orderService.getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (orders) => this.stateService.setData(orders),
        error: () => this.stateService.setError('Falha ao carregar pedidos')
      });
  }

  retry(): void {
    this.loadOrders();
  }
}
```

### Template com Estado Unificado

```html
<ng-container *ngIf="state$ | async as state">
  <!-- Loading -->
  <div *ngIf="state.loading" class="flex justify-content-center align-items-center py-8">
    <i class="pi pi-spin pi-spinner" style="font-size: 3rem; color: var(--primary-color);"></i>
  </div>

  <!-- Error -->
  <div *ngIf="state.error" class="text-center py-8">
    <i class="pi pi-exclamation-circle" style="font-size: 4rem; color: var(--red-500);"></i>
    <p class="text-xl mt-3">{{ state.error }}</p>
    <button pButton label="Tentar Novamente" icon="pi pi-refresh" class="mt-3" (click)="retry()"></button>
  </div>

  <!-- Empty -->
  <div *ngIf="!state.loading && !state.error && state.loaded && (!state.data || state.data.length === 0)" 
       class="text-center py-8">
    <i class="pi pi-inbox" style="font-size: 4rem; color: var(--text-color-secondary);"></i>
    <p class="text-xl mt-3">Nenhum pedido encontrado</p>
  </div>

  <!-- Data -->
  <div *ngIf="state.data && state.data.length > 0" class="grid">
    <div *ngFor="let order of state.data" class="col-12 md:col-6 lg:col-4">
      <app-order-card [order]="order"></app-order-card>
    </div>
  </div>
</ng-container>
```

## 🎨 Skeleton Loading (Carregamento Visual)

Melhor UX que spinner simples.

### Component

```typescript
isLoading = true;
items: Item[] = [];
skeletonItems = Array(6).fill(null); // 6 placeholders

loadData(): void {
  this.isLoading = true;
  
  this.service.getData()
    .pipe(finalize(() => this.isLoading = false))
    .subscribe(data => this.items = data);
}
```

### Template

```html
<!-- Skeleton Loading -->
<div *ngIf="isLoading" class="grid">
  <div *ngFor="let _ of skeletonItems" class="col-12 md:col-6 lg:col-4">
    <p-card>
      <p-skeleton width="100%" height="2rem" styleClass="mb-2"></p-skeleton>
      <p-skeleton width="80%" height="1rem" styleClass="mb-2"></p-skeleton>
      <p-skeleton width="60%" height="1rem" styleClass="mb-2"></p-skeleton>
      <p-skeleton width="100%" height="3rem"></p-skeleton>
    </p-card>
  </div>
</div>

<!-- Real Data -->
<div *ngIf="!isLoading" class="grid">
  <div *ngFor="let item of items" class="col-12 md:col-6 lg:col-4">
    <app-item-card [item]="item"></app-item-card>
  </div>
</div>
```

## 🔔 Toast Messages (Feedback Imediato)

### Service Setup

```typescript
// app.config.ts
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    MessageService
  ]
};
```

### Component

```typescript
import { MessageService } from 'primeng/api';

constructor(private messageService: MessageService) {}

showSuccess(message: string): void {
  this.messageService.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: message,
    life: 3000
  });
}

showError(message: string): void {
  this.messageService.add({
    severity: 'error',
    summary: 'Erro',
    detail: message,
    life: 5000
  });
}

showWarning(message: string): void {
  this.messageService.add({
    severity: 'warn',
    summary: 'Atenção',
    detail: message,
    life: 4000
  });
}

showInfo(message: string): void {
  this.messageService.add({
    severity: 'info',
    summary: 'Informação',
    detail: message,
    life: 3000
  });
}

// Uso
onSave(): void {
  this.service.save(this.data)
    .subscribe({
      next: () => this.showSuccess('Dados salvos com sucesso'),
      error: () => this.showError('Falha ao salvar dados')
    });
}
```

### Template

```html
<p-toast position="top-right"></p-toast>
```

### Toast Positions

```typescript
// Opções de posição
position: 'top-left' | 'top-center' | 'top-right' | 
          'bottom-left' | 'bottom-center' | 'bottom-right' | 'center'
```

## 🚨 Confirm Dialog (Confirmação de Ações)

### Component

```typescript
import { ConfirmationService } from 'primeng/api';

constructor(
  private confirmationService: ConfirmationService,
  private messageService: MessageService
) {}

onDelete(item: Item): void {
  this.confirmationService.confirm({
    message: `Deseja realmente excluir "${item.name}"?`,
    header: 'Confirmar Exclusão',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sim',
    rejectLabel: 'Não',
    acceptButtonStyleClass: 'p-button-danger',
    accept: () => {
      this.service.delete(item.id).subscribe({
        next: () => {
          this.showSuccess('Item excluído com sucesso');
          this.loadItems();
        },
        error: () => this.showError('Falha ao excluir item')
      });
    },
    reject: () => {
      // Usuário cancelou
    }
  });
}
```

### Template

```html
<p-confirmDialog></p-confirmDialog>
```

## 🔄 Pull-to-Refresh (Mobile)

```typescript
isRefreshing = false;

onRefresh(): void {
  this.isRefreshing = true;

  this.service.getData()
    .pipe(finalize(() => this.isRefreshing = false))
    .subscribe({
      next: (data) => {
        this.data = data;
        this.showSuccess('Dados atualizados');
      },
      error: () => this.showError('Falha ao atualizar')
    });
}
```

```html
<button 
  pButton 
  icon="pi pi-refresh" 
  label="Atualizar"
  [loading]="isRefreshing"
  (click)="onRefresh()">
</button>
```

## 📊 Progress Bar (Operações Longas)

```typescript
uploadProgress = 0;

onUpload(file: File): void {
  this.service.upload(file)
    .subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        }
      },
      complete: () => {
        this.uploadProgress = 100;
        this.showSuccess('Upload concluído');
      },
      error: () => this.showError('Falha no upload')
    });
}
```

```html
<p-progressBar 
  *ngIf="uploadProgress > 0" 
  [value]="uploadProgress">
</p-progressBar>
```

## 🎯 Loading Service Global

Para loading global em todas as páginas.

### loading.service.ts

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private requestsInProgress = 0;

  show(): void {
    this.requestsInProgress++;
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.requestsInProgress--;
    
    if (this.requestsInProgress <= 0) {
      this.requestsInProgress = 0;
      this.loadingSubject.next(false);
    }
  }
}
```

### loading.interceptor.ts

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

### app.component.html

```html
<div *ngIf="loadingService.loading$ | async" class="global-loading">
  <p-progressSpinner></p-progressSpinner>
</div>

<router-outlet></router-outlet>
```

### app.component.scss

```scss
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
```

## 🎨 Estados Visuais com CSS

### Componente de Loading Customizado

```typescript
@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading-overlay">
      <div class="loading-spinner">
        <i class="pi pi-spin pi-spinner"></i>
        <p *ngIf="message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }

    .loading-spinner {
      text-align: center;

      i {
        font-size: 3rem;
        color: var(--primary-color);
      }

      p {
        margin-top: 1rem;
        color: var(--text-color-secondary);
      }
    }
  `]
})
export class LoadingComponent {
  @Input() message?: string;
}
```

### Componente de Empty State

```typescript
@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <i [class]="icon"></i>
      <p class="title">{{ title }}</p>
      <p class="message">{{ message }}</p>
      <button 
        *ngIf="actionLabel"
        pButton 
        [label]="actionLabel" 
        [icon]="actionIcon"
        (click)="action.emit()">
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;

      i {
        font-size: 4rem;
        color: var(--text-color-secondary);
        margin-bottom: 1.5rem;
      }

      .title {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .message {
        color: var(--text-color-secondary);
        margin-bottom: 1.5rem;
      }
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'pi pi-inbox';
  @Input() title = 'Nenhum dado encontrado';
  @Input() message = '';
  @Input() actionLabel?: string;
  @Input() actionIcon = 'pi pi-plus';
  @Output() action = new EventEmitter<void>();
}
```

### Uso

```html
<app-empty-state
  icon="pi pi-shopping-cart"
  title="Carrinho vazio"
  message="Você ainda não adicionou nenhum produto"
  actionLabel="Ver Produtos"
  actionIcon="pi pi-arrow-right"
  (action)="goToProducts()">
</app-empty-state>
```

## ✅ Boas Práticas

### ✅ Fazer
- Sempre ter estado de loading
- Empty state amigável com ação
- Mensagens de erro claras
- Toast para feedback imediato
- Confirm dialog para ações destrutivas
- Loading na ação (botão loading)
- Skeleton para melhor UX
- Unsubscribe com takeUntil
- finalize() para sempre resetar loading

### ❌ Evitar
- Loading sem feedback visual
- Erros genéricos sem orientação
- Empty state sem ação
- Múltiplos loadings simultâneos
- Não usar finalize (loading fica travado)
- Toast com duração muito curta
- Ações destrutivas sem confirmação
- Loading global para tudo

## 📋 Checklist de Estados

- [ ] Loading implementado (spinner ou skeleton)
- [ ] Empty state com ícone e mensagem
- [ ] Error state com retry
- [ ] Toast para sucesso/erro
- [ ] Confirm dialog para exclusão
- [ ] Loading desabilitado botão submit
- [ ] finalize() usado para resetar loading
- [ ] takeUntil para unsubscribe
- [ ] Feedback visual em todas operações
- [ ] Estados testados (loading, error, empty, success)

## 🎯 RxJS Operators para Estados

```typescript
import { catchError, finalize, tap, retry, timeout } from 'rxjs/operators';

loadData(): void {
  this.isLoading = true;

  this.service.getData().pipe(
    timeout(30000), // 30s timeout
    retry(2), // Tenta 2x antes de falhar
    tap(() => console.log('Data loaded')),
    catchError(error => {
      this.showError('Falha ao carregar');
      return of([]); // Retorna array vazio
    }),
    finalize(() => this.isLoading = false)
  ).subscribe(data => this.data = data);
}
```
