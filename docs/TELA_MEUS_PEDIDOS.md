# 📋 Tela: Meus Pedidos (Orders)

Documentação completa da implementação atual da tela de **Meus Pedidos** do ClimbDelivery.

---

## 📍 Localização

**Caminho:** `src/app/features/dashboard/orders/`

**Rota:** `/dashboard/orders` (rota padrão do dashboard)

**Arquivos:**
- `orders.component.ts` - Lógica do componente
- `orders.component.html` - Template HTML
- `orders.component.scss` - Estilos

---

## 🎯 Objetivo da Tela

Exibir todos os pedidos em tempo real organizados em um **board estilo Kanban** com 3 colunas representando os diferentes status do pedido:

1. **Em Análise** (Pending)
2. **Em Produção** (In Production)
3. **Pronto para Entrega** (Ready)

---

## 🏗️ Arquitetura Atual

### Component (orders.component.ts)

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus, OrderStatusColumn } from '../../../core/models/order.model';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
```

**Propriedades:**

| Propriedade | Tipo | Descrição |
|------------|------|-----------|
| `columns` | `OrderStatusColumn[]` | Define as 3 colunas do kanban (título, status, cor) |
| `ordersByColumn` | `{ [key: string]: Order[] }` | Pedidos organizados por coluna |
| `loading` | `boolean` | Estado de carregamento |

**Métodos:**

| Método | Parâmetros | Retorno | Descrição |
|--------|-----------|---------|-----------|
| `loadOrders()` | - | `void` | Carrega todos os pedidos e organiza por coluna |
| `getOrderTime(order)` | `Order` | `string` | Calcula tempo decorrido desde criação ("Agora", "5 min atrás", "2h atrás") |
| `moveToNextStatus(order, currentColumn)` | `Order`, `OrderStatusColumn` | `void` | Move pedido para próxima coluna/status |
| `getTotalItems(order)` | `Order` | `number` | Soma quantidade total de itens do pedido |

---

## 🎨 Layout e UI

### Estrutura Visual

```
┌─────────────────────────────────────────────────────────────┐
│  Meus Pedidos                            [Atualizar ↻]     │
│  Gerencie os pedidos em tempo real                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐     │
│  │Em Análise│  │Em Produção│  │Pronto para Entrega  │     │
│  │    🟠 2  │  │    🔵 2   │  │       🟢 2           │     │
│  └──────────┘  └──────────┘  └──────────────────────┘     │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐     │
│  │ Card 1   │  │ Card 1   │  │       Card 1         │     │
│  │ #001     │  │ #003     │  │       #005           │     │
│  │ João     │  │ Pedro    │  │       Carlos         │     │
│  │ ...      │  │ ...      │  │       ...            │     │
│  └──────────┘  └──────────┘  └──────────────────────┘     │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐     │
│  │ Card 2   │  │ Card 2   │  │       Card 2         │     │
│  │ #002     │  │ #004     │  │       #006           │     │
│  └──────────┘  └──────────┘  └──────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Cards de Pedido

Cada card exibe:

**Cabeçalho:**
- ✅ Número do pedido (ex: `#001`)
- ✅ Badge de tipo (`Entrega` 🚗 ou `Retirada` 🛍️)
- ✅ Tempo decorrido (ex: "5 min atrás")

**Corpo:**
- ✅ Nome do cliente
- ✅ Telefone do cliente
- ✅ Endereço de entrega (se tipo delivery)
- ✅ Lista de itens com quantidades e preços
- ✅ Observações do pedido (se houver)

**Rodapé:**
- ✅ Valor total destacado
- ✅ Botão de ação para mover para próxima coluna (exceto última)
- ✅ Tempo estimado de preparo (se houver)

---

## 🎨 Estilos e Animações

### Cores das Colunas

| Coluna | Cor | Hex |
|--------|-----|-----|
| Em Análise | Laranja | `#f59e0b` |
| Em Produção | Azul | `#3b82f6` |
| Pronto para Entrega | Verde | `#10b981` |

### Badges de Tipo

| Tipo | Ícone | Cor de Fundo | Cor do Texto |
|------|-------|--------------|--------------|
| Delivery | `pi-car` | `#dbeafe` | `#1e40af` |
| Pickup | `pi-shopping-bag` | `#fef3c7` | `#92400e` |

### Animações

```scss
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- ✅ Cards surgem com animação `slideInUp` (0.3s)
- ✅ Efeito hover com `shadow-4` e transição suave
- ✅ Border esquerdo colorido (`var(--primary-color)`)

### Scroll Customizado

```scss
.orders-list {
  max-height: calc(100vh - 280px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
}
```

---

## 📊 Modelo de Dados

### Order Interface

```typescript
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress?: string;
  orderType: 'delivery' | 'pickup';
  createdAt: Date;
  estimatedTime?: number; // em minutos
  notes?: string;
}
```

### OrderItem Interface

```typescript
export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}
```

### OrderStatus Enum

```typescript
export enum OrderStatus {
  PENDING = 'pending',              // Em Análise
  IN_PRODUCTION = 'in_production',  // Em Produção
  READY = 'ready',                  // Pronto para Entrega
  OUT_FOR_DELIVERY = 'out_for_delivery', // Saiu para Entrega (não usado)
  DELIVERED = 'delivered',          // Entregue (não usado)
  CANCELLED = 'cancelled'           // Cancelado (não usado)
}
```

### OrderStatusColumn Interface

```typescript
export interface OrderStatusColumn {
  title: string;        // Título da coluna
  status: OrderStatus[]; // Status que pertencem a esta coluna
  color: string;        // Cor do cabeçalho
}
```

---

## 🔧 Service (order.service.ts)

### Mock Data

Atualmente usa **6 pedidos mockados**:
- 2 em "Em Análise" (#001, #002)
- 2 em "Em Produção" (#003, #004)
- 2 em "Pronto para Entrega" (#005, #006)

### Métodos do Service

| Método | Parâmetros | Retorno | Descrição |
|--------|-----------|---------|-----------|
| `getOrders()` | - | `Observable<Order[]>` | Retorna todos os pedidos (delay 300ms) |
| `getOrdersByStatus(statuses)` | `OrderStatus[]` | `Observable<Order[]>` | Filtra pedidos por status |
| `updateOrderStatus(orderId, newStatus)` | `string`, `OrderStatus` | `Observable<Order>` | Atualiza status do pedido |
| `formatCurrency(value)` | `number` | `string` | Formata valor em R$ |

**Exemplo de Mock:**

```typescript
{
  id: '1',
  orderNumber: '#001',
  customerName: 'João Silva',
  customerPhone: '(11) 98765-4321',
  items: [
    { id: '1', productName: 'Pizza Margherita', quantity: 1, unitPrice: 45.00, totalPrice: 45.00 },
    { id: '2', productName: 'Coca-Cola 2L', quantity: 1, unitPrice: 10.00, totalPrice: 10.00 }
  ],
  totalAmount: 55.00,
  status: OrderStatus.PENDING,
  deliveryAddress: 'Rua das Flores, 123 - Centro',
  orderType: 'delivery',
  createdAt: new Date(),
  estimatedTime: 45,
  notes: 'Sem cebola'
}
```

---

## ⚙️ Funcionalidades Implementadas

### ✅ O que está funcionando

1. **Visualização em Kanban** (3 colunas)
2. **Organização automática** de pedidos por status
3. **Contador de pedidos** em cada coluna
4. **Exibição detalhada** de cada pedido:
   - Número, cliente, telefone
   - Endereço (se delivery)
   - Lista de itens com preços
   - Observações
   - Tempo estimado
   - Tempo decorrido
5. **Badge visual** diferenciando Delivery/Pickup
6. **Botão de ação** para mover pedido para próxima coluna
7. **Formatação de moeda** em R$
8. **Botão "Atualizar"** com loading state
9. **Empty state** quando não há pedidos
10. **Loading overlay** durante carregamento
11. **Animações suaves** nos cards
12. **Scroll customizado** nas colunas
13. **Responsivo** (grid 12 cols → 4 cols no desktop)
14. **Tooltip** no botão de ação

---

## 🚧 Funcionalidades NÃO Implementadas

### ❌ O que ainda não existe

1. **Integração com API real** (atualmente usa mock)
2. **WebSocket/Polling** para atualização em tempo real
3. **Drag and Drop** entre colunas
4. **Detalhes do pedido** (modal ou página separada)
5. **Edição de pedido**
6. **Cancelamento de pedido**
7. **Impressão de comanda**
8. **Notificação sonora** de novo pedido
9. **Filtros avançados** (tipo, cliente, valor, data)
10. **Busca de pedidos**
11. **Ordenação** (mais recente, mais antigo, maior valor)
12. **Visualização alternativa** (lista/tabela)
13. **Histórico de mudanças** de status
14. **Tempo médio** de preparo por status
15. **Métricas e estatísticas** (pedidos/hora, ticket médio)
16. **Exportação** de dados (PDF, Excel)
17. **Status adicionais**:
    - "Saiu para Entrega" (OUT_FOR_DELIVERY)
    - "Entregue" (DELIVERED)
    - "Cancelado" (CANCELLED)
18. **Atribuição de entregador**
19. **Rastreamento de entrega**
20. **Chat com cliente**
21. **Avaliação do pedido**
22. **Reembolso/estorno**
23. **Pedidos recorrentes/favoritos**
24. **Agendamento de pedido**
25. **Multi-estabelecimento** (se aplicável)

---

## 📱 Responsividade

### Breakpoints

```scss
// Desktop (>= 768px)
.col-12 md:col-4  // 3 colunas lado a lado

// Mobile (< 768px)
.col-12           // 1 coluna por vez
```

### Ajustes Mobile

```scss
@media screen and (max-width: 768px) {
  .orders-list {
    max-height: none; // Remove scroll fixo
  }
}
```

---

## 🎨 Componentes PrimeNG Utilizados

| Componente | Import | Uso |
|-----------|--------|-----|
| Button | `ButtonModule` | Botões de ação e atualizar |
| Tooltip | `TooltipModule` | Tooltip no botão de mover pedido |

**Nota:** Não usa Card do PrimeNG, usa card customizado com classes do PrimeFlex.

---

## 🔄 Fluxo de Status

```
┌──────────────┐      ┌──────────────┐      ┌──────────────────────┐
│  Em Análise  │ ───> │ Em Produção  │ ───> │ Pronto para Entrega  │
│   (PENDING)  │      │(IN_PRODUCTION)│      │      (READY)         │
└──────────────┘      └──────────────┘      └──────────────────────┘
```

**Botões de ação:**
- Coluna 1 → Botão "Mover para Em Produção"
- Coluna 2 → Botão "Mover para Pronto para Entrega"
- Coluna 3 → Sem botão (última etapa)

---

## 🐛 Problemas Conhecidos

1. **Sem persistência:** Ao recarregar a página, mudanças de status são perdidas (mock reseta)
2. **Sem validação:** Permite mover pedido sem confirmar se está realmente pronto
3. **Sem notificação:** Usuário não é alertado quando novo pedido chega
4. **Sem histórico:** Não registra quem/quando mudou o status
5. **Performance:** Não otimizado para muitos pedidos (100+)

---

## 🎯 Estados da Interface

### Loading State

```html
<div class="loading-overlay" *ngIf="loading">
  <i class="pi pi-spin pi-spinner text-6xl text-primary"></i>
</div>
```

**Quando exibir:**
- Durante `loadOrders()`
- Ao clicar em "Atualizar"

### Empty State

```html
<div class="surface-card p-4 border-round text-center">
  <i class="pi pi-inbox text-4xl text-400 mb-2"></i>
  <p class="text-600 m-0">Nenhum pedido nesta etapa</p>
</div>
```

**Quando exibir:**
- Quando coluna não tem pedidos

### Error State

❌ **NÃO IMPLEMENTADO**

---

## 📝 Observações Técnicas

### Standalone Component

```typescript
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  // ...
})
```

### Pipe async NÃO usado

Atualmente **não usa** Observables diretamente no template. Usa subscribe no component.

### Unsubscribe

⚠️ **ATENÇÃO:** Não está fazendo unsubscribe. Deveria usar:

```typescript
private destroy$ = new Subject<void>();

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

// No subscribe:
.pipe(takeUntil(this.destroy$))
```

---

## 🔮 Integração Futura com Backend

### Endpoints esperados

```typescript
// GET - Listar pedidos
GET /api/orders
Response: Order[]

// GET - Pedido específico
GET /api/orders/:id
Response: Order

// PATCH - Atualizar status
PATCH /api/orders/:id/status
Body: { status: OrderStatus }
Response: Order

// WebSocket - Novos pedidos
WS /api/orders/stream
Event: 'new-order', 'order-updated', 'order-cancelled'
```

### Substituir Mock por HTTP

```typescript
import { HttpClient } from '@angular/common/http';

getOrders(): Observable<Order[]> {
  return this.http.get<Order[]>(`${this.apiUrl}/orders`);
}

updateOrderStatus(orderId: string, newStatus: OrderStatus): Observable<Order> {
  return this.http.patch<Order>(`${this.apiUrl}/orders/${orderId}/status`, { 
    status: newStatus 
  });
}
```

---

## ✅ Checklist de Qualidade

### ✅ Implementado
- [x] Component standalone
- [x] Imports organizados
- [x] Responsivo (mobile/tablet/desktop)
- [x] Loading state
- [x] Empty state
- [x] Animações suaves
- [x] Formatação de moeda
- [x] Tipos TypeScript explícitos
- [x] Separação de concerns (component/service/model)

### ❌ Pendente
- [ ] Unsubscribe com takeUntil
- [ ] Error handling com toast
- [ ] Confirmação antes de mover pedido
- [ ] Testes unitários
- [ ] Testes E2E
- [ ] Acessibilidade (ARIA labels)
- [ ] Internacionalização (i18n)

---

## 📚 Referências de Código

### Arquivos Relacionados

```
src/app/
├── core/
│   ├── models/
│   │   └── order.model.ts          # Interfaces e Enums
│   └── services/
│       └── order.service.ts        # Service com mock
└── features/
    └── dashboard/
        ├── orders/
        │   ├── orders.component.ts   # Lógica
        │   ├── orders.component.html # Template
        │   └── orders.component.scss # Estilos
        └── dashboard.routes.ts       # Rota /dashboard/orders
```

### Rotas

```typescript
// dashboard.routes.ts
{
  path: 'orders',
  component: OrdersComponent
}

// Acesso: /dashboard/orders (rota padrão)
```

---

## 🎯 Resumo do Estado Atual

### ✅ Pontos Fortes
1. Layout Kanban visual e intuitivo
2. Cards bem estruturados com todas informações importantes
3. Responsivo e com boas animações
4. Código organizado (component/service/model separados)
5. Types explícitos sem uso de `any`

### ⚠️ Pontos de Melhoria
1. Falta integração com API real (mock apenas)
2. Sem tratamento de erro
3. Sem notificação de novos pedidos
4. Sem drag and drop
5. Sem detalhes expandidos do pedido
6. Memory leak (sem unsubscribe)
7. Falta de filtros e busca
8. Sem confirmação antes de mover pedido

### 🚀 Próximos Passos Sugeridos
1. Adicionar unsubscribe (takeUntil pattern)
2. Implementar toast para feedback de ações
3. Adicionar confirm dialog antes de mover pedido
4. Criar modal/página de detalhes do pedido
5. Implementar filtros (tipo, status, cliente)
6. Adicionar busca por número/cliente
7. Implementar drag and drop (PrimeNG DragDrop ou similar)
8. Integrar com WebSocket para atualização em tempo real
9. Adicionar notificação sonora de novo pedido
10. Implementar impressão de comanda

---

## 📊 Métricas de Código

- **Linhas de TypeScript:** ~80 linhas (orders.component.ts)
- **Linhas de HTML:** ~120 linhas (orders.component.html)
- **Linhas de SCSS:** ~50 linhas (orders.component.scss)
- **Dependências PrimeNG:** 2 módulos (Button, Tooltip)
- **Mock Orders:** 6 pedidos
- **Status implementados:** 3 de 6 possíveis

---

**Última atualização:** 09/11/2025  
**Versão do Angular:** 19.2.19  
**Versão do PrimeNG:** 20.3.0
