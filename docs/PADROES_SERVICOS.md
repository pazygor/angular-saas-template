# 🔧 Padrões de Serviços e API

## Estrutura de Services

Os services no ClimbDelivery são **singleton** e ficam na pasta `core/services/`.

## 📁 Anatomia de um Service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// Models
import { Order, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'  // Singleton em toda aplicação
})
export class OrderService {
  // URL base da API
  private apiUrl = 'http://localhost:3000/api';

  // Estado reativo (opcional)
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {}

  // GET - Lista
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`).pipe(
      tap(orders => this.ordersSubject.next(orders)),
      catchError(this.handleError)
    );
  }

  // GET - Por ID
  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // POST - Criar
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order).pipe(
      tap(newOrder => {
        const currentOrders = this.ordersSubject.value;
        this.ordersSubject.next([...currentOrders, newOrder]);
      }),
      catchError(this.handleError)
    );
  }

  // PUT - Atualizar
  updateOrder(id: string, order: Partial<Order>): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/orders/${id}`, order).pipe(
      tap(updatedOrder => {
        const currentOrders = this.ordersSubject.value;
        const index = currentOrders.findIndex(o => o.id === id);
        if (index !== -1) {
          currentOrders[index] = updatedOrder;
          this.ordersSubject.next([...currentOrders]);
        }
      }),
      catchError(this.handleError)
    );
  }

  // PATCH - Atualização parcial
  updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${id}/status`, { status }).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE
  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/orders/${id}`).pipe(
      tap(() => {
        const currentOrders = this.ordersSubject.value;
        this.ordersSubject.next(currentOrders.filter(o => o.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  // Método auxiliar de tratamento de erro
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Código: ${error.status}\nMensagem: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
```

## 🔐 Auth Service

### auth.service.ts

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User, LoginRequest, LoginResponse } from '../models/user.model';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  // Estado de autenticação
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadAuthState();
  }

  // Carregar estado do localStorage
  private loadAuthState(): void {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('currentUser');

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.authStateSubject.next({
          user,
          token,
          isAuthenticated: true
        });
      } catch (error) {
        this.clearAuthState();
      }
    }
  }

  // Login
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));

        this.authStateSubject.next({
          user: response.user,
          token: response.token,
          isAuthenticated: true
        });
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Falha no login'));
      })
    );
  }

  // Logout
  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/auth/login']);
  }

  // Limpar estado
  private clearAuthState(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    this.authStateSubject.next({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  // Obter usuário atual
  getCurrentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  // Obter token
  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  // Recuperar senha
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, { email });
  }

  // Resetar senha
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, {
      token,
      newPassword
    });
  }
}
```

## 🔌 HTTP Interceptors

### auth.interceptor.ts

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Adicionar token se existir e não for rota de auth
  if (token && !req.url.includes('/auth/')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

### error.interceptor.ts (Exemplo)

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      // 401 - Não autenticado
      if (error.status === 401) {
        localStorage.clear();
        router.navigate(['/auth/login']);
      }

      // 403 - Sem permissão
      if (error.status === 403) {
        router.navigate(['/dashboard']);
      }

      // 500 - Erro do servidor
      if (error.status === 500) {
        console.error('Erro interno do servidor');
      }

      return throwError(() => error);
    })
  );
};
```

### loading.interceptor.ts (Exemplo)

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

## 🎯 Mock Service (Desenvolvimento)

Útil para desenvolver sem backend pronto:

```typescript
import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class MockOrderService {
  private mockOrders: Order[] = [
    {
      id: '1',
      customerName: 'João Silva',
      items: [
        { id: '1', name: 'Pizza Margherita', quantity: 2, price: 45.00 }
      ],
      status: OrderStatus.PENDING,
      total: 90.00,
      createdAt: new Date(),
      deliveryAddress: {
        street: 'Rua ABC',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      }
    },
    // ... mais pedidos
  ];

  getOrders(): Observable<Order[]> {
    // Simular delay de API
    return of(this.mockOrders).pipe(delay(500));
  }

  getOrderById(id: string): Observable<Order> {
    const order = this.mockOrders.find(o => o.id === id);
    
    if (order) {
      return of(order).pipe(delay(300));
    }
    
    return throwError(() => new Error('Pedido não encontrado'));
  }

  createOrder(order: Order): Observable<Order> {
    const newOrder = {
      ...order,
      id: String(Date.now()),
      createdAt: new Date()
    };
    
    this.mockOrders.push(newOrder);
    return of(newOrder).pipe(delay(500));
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
    const order = this.mockOrders.find(o => o.id === id);
    
    if (order) {
      order.status = status;
      return of(order).pipe(delay(300));
    }
    
    return throwError(() => new Error('Pedido não encontrado'));
  }
}
```

## 🔄 Cache Service (Exemplo)

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, any>();
  private cacheTime = 5 * 60 * 1000; // 5 minutos

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    const isExpired = Date.now() - cached.timestamp > this.cacheTime;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Wrapper para observables com cache
  cachedRequest<T>(
    key: string,
    request: Observable<T>
  ): Observable<T> {
    const cached = this.get<T>(key);
    
    if (cached) {
      return of(cached);
    }

    return request.pipe(
      tap(data => this.set(key, data)),
      shareReplay(1)
    );
  }
}

// Uso
export class OrderService {
  constructor(
    private http: HttpClient,
    private cache: CacheService
  ) {}

  getOrders(): Observable<Order[]> {
    return this.cache.cachedRequest(
      'orders',
      this.http.get<Order[]>(`${this.apiUrl}/orders`)
    );
  }
}
```

## 📱 WebSocket Service (Exemplo Futuro)

```typescript
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;
  private messagesSubject = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable();

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('WebSocket conectado');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messagesSubject.next(data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket erro:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket desconectado');
    };
  }

  send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
```

## 🔑 Environment Variables

### environment.ts (desenvolvimento)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000',
  enableMocks: true,
  logLevel: 'debug'
};
```

### environment.prod.ts (produção)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.climbdelivery.com',
  wsUrl: 'wss://api.climbdelivery.com',
  enableMocks: false,
  logLevel: 'error'
};
```

### Uso

```typescript
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  // ...
}
```

## ✅ Boas Práticas

### ✅ Fazer
- Services sempre singleton (`providedIn: 'root'`)
- Usar RxJS operators para transformações
- Tratamento de erro consistente
- Cache quando apropriado
- Tipos explícitos para requests/responses
- Unsubscribe de observables no componente
- Usar interceptors para concerns transversais
- Environment variables para configuração

### ❌ Evitar
- Lógica de negócio nos componentes
- Subscriptions sem unsubscribe
- Uso excessivo de any
- Chamadas HTTP diretas nos componentes
- Múltiplas chamadas para mesmo endpoint
- Hardcoded URLs
- Exposição de BehaviorSubject (expor apenas o Observable)
- Requests síncronos (usar async sempre)

## 📝 Padrão de Retorno de API

```typescript
// Sucesso
{
  data: T,
  message?: string,
  timestamp: string
}

// Erro
{
  error: {
    code: string,
    message: string,
    details?: any
  },
  timestamp: string
}

// Lista paginada
{
  data: T[],
  pagination: {
    page: number,
    pageSize: number,
    total: number,
    totalPages: number
  }
}
```
