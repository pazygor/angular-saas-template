# 🚦 Padrões de Roteamento

## Arquitetura de Rotas

O ClimbDelivery utiliza **lazy loading** e **standalone components** para otimizar o carregamento da aplicação.

## 📁 Estrutura de Arquivos de Rotas

```
src/app/
├── app.routes.ts              # Rotas principais
├── app.routes.server.ts       # Rotas SSR (se habilitado)
└── features/
    ├── auth/
    │   └── auth.routes.ts     # Rotas de autenticação
    └── dashboard/
        └── dashboard.routes.ts # Rotas do dashboard
```

## 🎯 Rotas Principais (app.routes.ts)

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  // Rota raiz - redireciona para dashboard
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // Rotas de autenticação (sem layout)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Rotas do dashboard (com layout e guard)
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },

  // Rota 404 - sempre por último
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
```

## 🔐 Rotas de Autenticação (auth.routes.ts)

```typescript
import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  }
];
```

## 🏠 Rotas do Dashboard (dashboard.routes.ts)

```typescript
import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    loadComponent: () => import('./orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'menu',
    loadComponent: () => import('./menu/menu.component').then(m => m.MenuComponent)
  },
  {
    path: 'delivery',
    loadComponent: () => import('./delivery/delivery.component').then(m => m.DeliveryComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'account',
    loadComponent: () => import('./account/account.component').then(m => m.AccountComponent)
  }
];
```

## 🛡️ Guards

### Auth Guard (auth.guard.ts)

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redireciona para login com returnUrl
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
```

### Admin Guard (Exemplo Futuro)

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
  
  if (currentUser && currentUser.role === 'admin') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
```

### Role Guard (Genérico)

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentUser = authService.getCurrentUser();
    
    if (currentUser && allowedRoles.includes(currentUser.role)) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };
};

// Uso nas rotas
{
  path: 'admin',
  canActivate: [roleGuard(['admin', 'manager'])],
  loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent)
}
```

## 🔄 Navegação Programática

### No Component

```typescript
import { Router } from '@angular/router';

export class LoginComponent {
  constructor(private router: Router) {}

  // Navegação simples
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  // Navegação com parâmetros
  goToOrder(orderId: string): void {
    this.router.navigate(['/dashboard/orders', orderId]);
  }

  // Navegação com query params
  goToOrders(status: string): void {
    this.router.navigate(['/dashboard/orders'], {
      queryParams: { status }
    });
  }

  // Navegação relativa
  goToDetails(id: string): void {
    this.router.navigate(['details', id], { relativeTo: this.route });
  }

  // Voltar
  goBack(): void {
    this.location.back();
  }

  // Navegação com state (dados temporários)
  goToOrderWithData(order: Order): void {
    this.router.navigate(['/dashboard/orders', order.id], {
      state: { order }
    });
  }
}
```

### No Template

```html
<!-- Navegação simples -->
<a routerLink="/dashboard/orders">Pedidos</a>

<!-- Navegação com parâmetros -->
<a [routerLink]="['/dashboard/orders', order.id]">Ver Pedido</a>

<!-- Navegação com query params -->
<a [routerLink]="['/dashboard/orders']" [queryParams]="{status: 'pending'}">
  Pedidos Pendentes
</a>

<!-- Active class -->
<a 
  routerLink="/dashboard/orders" 
  routerLinkActive="active"
  [routerLinkActiveOptions]="{exact: true}"
>
  Pedidos
</a>

<!-- Botão com navegação -->
<button 
  pButton 
  label="Ver Detalhes"
  (onClick)="router.navigate(['/dashboard/orders', order.id])"
></button>
```

## 📊 Parâmetros de Rota

### Definindo Rotas com Parâmetros

```typescript
export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'orders/:id',
    loadComponent: () => import('./order-details/order-details.component').then(m => m.OrderDetailsComponent)
  },
  {
    path: 'orders/:id/edit',
    loadComponent: () => import('./order-edit/order-edit.component').then(m => m.OrderEditComponent)
  }
];
```

### Acessando Parâmetros

```typescript
import { ActivatedRoute } from '@angular/router';

export class OrderDetailsComponent implements OnInit {
  orderId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Snapshot (valor atual)
    this.orderId = this.route.snapshot.paramMap.get('id') || '';

    // Observable (reativo - melhor para mudanças)
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('id') || '';
      this.loadOrder(this.orderId);
    });

    // Query params
    this.route.queryParamMap.subscribe(queryParams => {
      const returnUrl = queryParams.get('returnUrl');
      const filter = queryParams.get('filter');
    });
  }
}
```

## 🎨 Menu Lateral com RouterLink

### sidebar.component.html

```html
<div class="sidebar">
  <div class="menu">
    <div *ngFor="let item of menuItems" class="menu-item">
      <!-- Item sem filhos -->
      <a 
        *ngIf="!item.children"
        [routerLink]="item.route"
        routerLinkActive="active"
        class="menu-link"
      >
        <i [class]="item.icon"></i>
        <span>{{ item.label }}</span>
      </a>

      <!-- Item com filhos -->
      <div *ngIf="item.children">
        <a 
          class="menu-link menu-parent"
          (click)="toggleSubmenu(item)"
        >
          <i [class]="item.icon"></i>
          <span>{{ item.label }}</span>
          <i class="pi pi-chevron-down ml-auto"></i>
        </a>
        
        <div *ngIf="item.expanded" class="submenu">
          <a 
            *ngFor="let child of item.children"
            [routerLink]="child.route"
            routerLinkActive="active"
            class="submenu-link"
          >
            {{ child.label }}
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
```

### sidebar.component.ts

```typescript
export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

export class SidebarComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Pedidos',
      icon: 'pi pi-shopping-cart',
      route: '/dashboard/orders'
    },
    {
      label: 'Cardápio',
      icon: 'pi pi-book',
      route: '/dashboard/menu'
    },
    {
      label: 'Entregadores',
      icon: 'pi pi-users',
      route: '/dashboard/delivery'
    },
    {
      label: 'Relatórios',
      icon: 'pi pi-chart-bar',
      route: '/dashboard/reports'
    },
    {
      label: 'Configurações',
      icon: 'pi pi-cog',
      children: [
        { label: 'Geral', route: '/dashboard/settings/general' },
        { label: 'Integrações', route: '/dashboard/settings/integrations' },
        { label: 'Notificações', route: '/dashboard/settings/notifications' }
      ]
    }
  ];

  toggleSubmenu(item: MenuItem): void {
    item.expanded = !item.expanded;
  }
}
```

## 🎯 Resolvers (Pre-loading Data)

### order.resolver.ts

```typescript
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order.model';

export const orderResolver: ResolveFn<Order> = (route, state) => {
  const orderService = inject(OrderService);
  const orderId = route.paramMap.get('id') || '';
  
  return orderService.getOrderById(orderId);
};
```

### Usando o Resolver

```typescript
// Na rota
{
  path: 'orders/:id',
  loadComponent: () => import('./order-details/order-details.component').then(m => m.OrderDetailsComponent),
  resolve: {
    order: orderResolver
  }
}

// No component
export class OrderDetailsComponent implements OnInit {
  order!: Order;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Dados já carregados pelo resolver
    this.order = this.route.snapshot.data['order'];
  }
}
```

## 🔄 Route Reuse Strategy (Avançado)

Para reusar componentes ao navegar entre rotas similares:

```typescript
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {}

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}

// Em app.config.ts
providers: [
  { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
]
```

## ✅ Boas Práticas

### ✅ Fazer
- Usar lazy loading para todas as features
- Guards para proteção de rotas
- Redirect de rotas não autorizadas
- Feedback visual ao navegar (loading)
- breadcrumbs para navegação hierárquica
- Query params para filtros e pesquisas
- Preservar estado ao voltar (queryParams)

### ❌ Evitar
- Carregamento eager de módulos grandes
- Lógica de autenticação nos componentes
- Navegação sem tratamento de erro
- URLs complexas e pouco intuitivas
- Perda de dados ao navegar
- Rotas hardcoded (sempre usar constantes)

## 📝 Convenções de URL

```
// ✅ Boas URLs
/dashboard/orders
/dashboard/orders/123
/dashboard/orders/123/edit
/dashboard/menu/categories/5
/dashboard/settings/general

// ❌ Evitar
/dashboard/Order
/dashboard/orders-list
/dashboard/editOrder/123
/orders_management
```

## 🎯 Estrutura de URL Recomendada

```
/{área}/{recurso}[/{id}][/{ação}]

Exemplos:
/dashboard/orders           - Lista
/dashboard/orders/new       - Criar
/dashboard/orders/123       - Detalhes
/dashboard/orders/123/edit  - Editar
/auth/login                 - Login
/auth/forgot-password       - Recuperar senha
```
