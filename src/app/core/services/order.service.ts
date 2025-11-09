import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private mockOrders: Order[] = [
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
    },
    {
      id: '2',
      orderNumber: '#002',
      customerName: 'Maria Santos',
      customerPhone: '(11) 91234-5678',
      items: [
        { id: '3', productName: 'Hambúrguer Artesanal', quantity: 2, unitPrice: 35.00, totalPrice: 70.00 },
        { id: '4', productName: 'Batata Frita', quantity: 1, unitPrice: 15.00, totalPrice: 15.00 }
      ],
      totalAmount: 85.00,
      status: OrderStatus.PENDING,
      deliveryAddress: 'Av. Principal, 456 - Jardins',
      orderType: 'delivery',
      createdAt: new Date(Date.now() - 300000),
      estimatedTime: 50
    },
    {
      id: '3',
      orderNumber: '#003',
      customerName: 'Pedro Costa',
      customerPhone: '(11) 99876-5432',
      items: [
        { id: '5', productName: 'Sushi Combo', quantity: 1, unitPrice: 89.90, totalPrice: 89.90 }
      ],
      totalAmount: 89.90,
      status: OrderStatus.IN_PRODUCTION,
      deliveryAddress: 'Rua do Comércio, 789',
      orderType: 'delivery',
      createdAt: new Date(Date.now() - 900000),
      estimatedTime: 30
    },
    {
      id: '4',
      orderNumber: '#004',
      customerName: 'Ana Oliveira',
      customerPhone: '(11) 97654-3210',
      items: [
        { id: '6', productName: 'Salada Caesar', quantity: 1, unitPrice: 32.00, totalPrice: 32.00 },
        { id: '7', productName: 'Suco Natural', quantity: 2, unitPrice: 12.00, totalPrice: 24.00 }
      ],
      totalAmount: 56.00,
      status: OrderStatus.IN_PRODUCTION,
      orderType: 'pickup',
      createdAt: new Date(Date.now() - 600000),
      estimatedTime: 20
    },
    {
      id: '5',
      orderNumber: '#005',
      customerName: 'Carlos Mendes',
      customerPhone: '(11) 96543-2109',
      items: [
        { id: '8', productName: 'Açaí 500ml', quantity: 2, unitPrice: 25.00, totalPrice: 50.00 }
      ],
      totalAmount: 50.00,
      status: OrderStatus.READY,
      deliveryAddress: 'Rua Nova, 321',
      orderType: 'delivery',
      createdAt: new Date(Date.now() - 1200000),
      notes: 'Sem granola'
    },
    {
      id: '6',
      orderNumber: '#006',
      customerName: 'Fernanda Lima',
      customerPhone: '(11) 95432-1098',
      items: [
        { id: '9', productName: 'Pastel de Carne', quantity: 4, unitPrice: 8.00, totalPrice: 32.00 }
      ],
      totalAmount: 32.00,
      status: OrderStatus.READY,
      orderType: 'pickup',
      createdAt: new Date(Date.now() - 1500000)
    }
  ];

  constructor() { }

  /**
   * Retorna todos os pedidos (mock)
   * Em produção, fazer requisição HTTP ao backend
   */
  getOrders(): Observable<Order[]> {
    return of(this.mockOrders).pipe(delay(300));
  }

  /**
   * Retorna pedidos filtrados por status
   */
  getOrdersByStatus(statuses: OrderStatus[]): Observable<Order[]> {
    const filtered = this.mockOrders.filter(order => statuses.includes(order.status));
    return of(filtered).pipe(delay(300));
  }

  /**
   * Atualiza o status de um pedido
   */
  updateOrderStatus(orderId: string, newStatus: OrderStatus): Observable<Order> {
    const order = this.mockOrders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
    }
    return of(order!).pipe(delay(300));
  }

  /**
   * Formata valor em moeda brasileira
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}
