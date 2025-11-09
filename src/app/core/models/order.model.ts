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

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export enum OrderStatus {
  PENDING = 'pending',           // Em Análise
  IN_PRODUCTION = 'in_production', // Em Produção
  READY = 'ready',               // Pronto para Entrega
  OUT_FOR_DELIVERY = 'out_for_delivery', // Saiu para Entrega
  DELIVERED = 'delivered',       // Entregue
  CANCELLED = 'cancelled'        // Cancelado
}

export interface OrderStatusColumn {
  title: string;
  status: OrderStatus[];
  color: string;
}
