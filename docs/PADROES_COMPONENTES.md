# 🎨 Padrões de Componentes

## Estrutura de um Componente Standalone

Todos os componentes do ClimbDelivery seguem a arquitetura **standalone** do Angular 19.

### Template Básico

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

// Services
import { AuthService } from '../../../core/services/auth.service';

// Models
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-nome-componente',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './nome-componente.component.html',
  styleUrl: './nome-componente.component.scss'
})
export class NomeComponenteComponent implements OnInit {
  // Properties
  loading = false;
  data: any[] = [];

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Implementação
  }
}
```

## 📋 Anatomia de um Componente

### 1. Imports Organizados

Sempre organize os imports em grupos:

```typescript
// 1. Angular Core
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// 2. Angular Forms/Router (se necessário)
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// 3. PrimeNG Components (alfabeticamente)
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

// 4. Services (do mais específico ao mais genérico)
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';

// 5. Models e Types
import { Order, OrderStatus } from '../../../core/models/order.model';
import { User } from '../../../core/models/user.model';
```

### 2. Decorator @Component

```typescript
@Component({
  selector: 'app-nome-componente',     // Sempre com prefixo 'app-'
  standalone: true,                     // SEMPRE true
  imports: [                            // Módulos necessários
    CommonModule,                       // SEMPRE incluir
    // ... outros módulos
  ],
  providers: [],                        // Services locais (raro)
  templateUrl: './nome-componente.component.html',
  styleUrl: './nome-componente.component.scss'  // Note: styleUrl (singular)
})
```

### 3. Estrutura da Classe

```typescript
export class NomeComponenteComponent implements OnInit {
  // 1. Input/Output Properties
  @Input() userId?: string;
  @Output() onSave = new EventEmitter<User>();

  // 2. Public Properties (usadas no template)
  loading = false;
  users: User[] = [];
  selectedUser: User | null = null;

  // 3. Form Properties
  userForm!: FormGroup;

  // 4. Private Properties
  private destroyed$ = new Subject<void>();

  // 5. Constructor (injeção de dependências)
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  // 6. Lifecycle Hooks (em ordem)
  ngOnInit(): void {
    this.initializeForm();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  // 7. Public Methods (usados no template)
  saveUser(): void {
    // Implementação
  }

  // 8. Private Methods (auxiliares)
  private initializeForm(): void {
    // Implementação
  }

  // 9. Getters (se necessário)
  get isFormValid(): boolean {
    return this.userForm.valid;
  }
}
```

## 🎯 Tipos de Componentes

### 1. Smart Component (Container)

**Responsabilidades:**
- Gerencia estado
- Chama services
- Lógica de negócio
- Roteamento

**Exemplo: OrdersComponent**

```typescript
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrderCardComponent],
  template: `
    <div class="orders-container">
      <app-order-card 
        *ngFor="let order of orders"
        [order]="order"
        (onStatusChange)="updateOrderStatus($event)"
      />
    </div>
  `
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error(err)
    });
  }

  updateOrderStatus(event: { orderId: string, status: OrderStatus }): void {
    this.orderService.updateOrderStatus(event.orderId, event.status).subscribe();
  }
}
```

### 2. Dumb Component (Presentational)

**Responsabilidades:**
- Apenas apresentação
- Recebe dados via @Input
- Emite eventos via @Output
- Sem lógica de negócio
- Sem chamadas de services

**Exemplo: OrderCardComponent**

```typescript
@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `
    <p-card>
      <h3>Pedido #{{ order.id }}</h3>
      <p>{{ order.customerName }}</p>
      <p-button 
        label="Mudar Status"
        (onClick)="changeStatus()"
      />
    </p-card>
  `
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;
  @Output() onStatusChange = new EventEmitter<{orderId: string, status: OrderStatus}>();

  changeStatus(): void {
    this.onStatusChange.emit({
      orderId: this.order.id,
      status: OrderStatus.IN_PRODUCTION
    });
  }
}
```

## 📝 Convenções de Nomenclatura

### Seletores
```typescript
// ✅ Correto
selector: 'app-user-list'
selector: 'app-order-card'
selector: 'app-delivery-map'

// ❌ Errado
selector: 'userList'
selector: 'OrderCard'
selector: 'app_delivery_map'
```

### Propriedades
```typescript
// ✅ Correto
loading = false;
currentUser: User | null = null;
ordersByStatus: { [key: string]: Order[] } = {};

// ❌ Errado
Loading = false;
current_user: User | null = null;
orders_by_status: any = {};
```

### Métodos
```typescript
// ✅ Correto - Verbos descritivos
loadOrders(): void {}
updateUserProfile(): void {}
handleFormSubmit(): void {}
isFormValid(): boolean {}

// ❌ Errado
orders(): void {}
user(): void {}
submit(): void {}
valid(): boolean {}
```

## 🔄 Gerenciamento de Estado

### Estado Local (Reativo)

```typescript
export class OrdersComponent implements OnInit, OnDestroy {
  // Usando BehaviorSubject para estado reativo
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private destroyed$ = new Subject<void>();

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loadingSubject.next(true);
    
    this.orderService.getOrders()
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (orders) => {
          this.ordersSubject.next(orders);
          this.loadingSubject.next(false);
        },
        error: (err) => {
          console.error(err);
          this.loadingSubject.next(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
```

### Template com Async Pipe

```html
<div *ngIf="loading$ | async" class="loading-spinner">
  Carregando...
</div>

<div *ngIf="!(loading$ | async) && (orders$ | async) as orders">
  <app-order-card 
    *ngFor="let order of orders"
    [order]="order"
  />
</div>
```

## 🎨 Componentes com PrimeNG

### Imports Necessários

```typescript
// Sempre importar os módulos do PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

// Para Toasts, importar o service
import { MessageService } from 'primeng/api';

@Component({
  // ...
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService]  // Apenas se usar Toast/Message
})
```

### Uso de Diretivas PrimeNG

```html
<!-- Botões -->
<button 
  pButton 
  label="Salvar"
  icon="pi pi-check"
  [loading]="loading"
  (onClick)="save()"
></button>

<!-- Inputs -->
<input 
  pInputText 
  type="text"
  [(ngModel)]="userName"
  placeholder="Nome do usuário"
/>

<!-- Cards -->
<p-card header="Título do Card">
  <ng-template pTemplate="header">
    <div class="flex align-items-center justify-content-between">
      <h3>Pedido #123</h3>
      <span class="badge">Novo</span>
    </div>
  </ng-template>
  
  <p>Conteúdo do card</p>
  
  <ng-template pTemplate="footer">
    <button pButton label="Ação"></button>
  </ng-template>
</p-card>
```

## ✅ Checklist de Qualidade

Antes de commitar um componente, verifique:

- [ ] É standalone (`standalone: true`)
- [ ] Imports organizados por categoria
- [ ] CommonModule sempre incluído
- [ ] Properties tipadas (evitar `any`)
- [ ] Métodos com tipo de retorno explícito
- [ ] Unsubscribe de Observables (usando `takeUntil`)
- [ ] Template HTML separado (não inline para componentes grandes)
- [ ] Estilos SCSS separados
- [ ] Nomes descritivos e consistentes
- [ ] Comentários em lógica complexa
- [ ] Sem console.log em produção
- [ ] Tratamento de erro apropriado

## 🚫 Anti-Patterns (Evitar)

```typescript
// ❌ Lógica de negócio no componente
loadOrders(): void {
  // NÃO faça chamadas HTTP diretamente
  this.http.get('/api/orders').subscribe(...);
}

// ✅ Use services
loadOrders(): void {
  this.orderService.getOrders().subscribe(...);
}

// ❌ Manipulação direta do DOM
document.getElementById('myElement').style.color = 'red';

// ✅ Use property binding
<div [style.color]="elementColor">

// ❌ Subscriptions não gerenciadas
ngOnInit(): void {
  this.service.getData().subscribe(data => {
    this.data = data;
  }); // Memory leak!
}

// ✅ Sempre fazer unsubscribe
ngOnInit(): void {
  this.service.getData()
    .pipe(takeUntil(this.destroyed$))
    .subscribe(data => this.data = data);
}
```
