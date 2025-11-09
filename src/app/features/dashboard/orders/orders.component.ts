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
export class OrdersComponent implements OnInit {
  columns: OrderStatusColumn[] = [
    {
      title: 'Em Análise',
      status: [OrderStatus.PENDING],
      color: '#f59e0b'
    },
    {
      title: 'Em Produção',
      status: [OrderStatus.IN_PRODUCTION],
      color: '#3b82f6'
    },
    {
      title: 'Pronto para Entrega',
      status: [OrderStatus.READY],
      color: '#10b981'
    }
  ];

  ordersByColumn: { [key: string]: Order[] } = {};
  loading = false;

  constructor(public orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        // Organiza os pedidos por coluna
        this.columns.forEach(column => {
          this.ordersByColumn[column.title] = orders.filter(order => 
            column.status.includes(order.status)
          );
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
        this.loading = false;
      }
    });
  }

  getOrderTime(order: Order): string {
    const now = new Date().getTime();
    const orderTime = new Date(order.createdAt).getTime();
    const diffMinutes = Math.floor((now - orderTime) / 60000);
    
    if (diffMinutes < 1) return 'Agora';
    if (diffMinutes < 60) return `${diffMinutes} min atrás`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h atrás`;
  }

  moveToNextStatus(order: Order, currentColumn: OrderStatusColumn): void {
    const currentIndex = this.columns.indexOf(currentColumn);
    
    if (currentIndex < this.columns.length - 1) {
      const nextColumn = this.columns[currentIndex + 1];
      const newStatus = nextColumn.status[0];
      
      this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
        next: () => {
          this.loadOrders();
        }
      });
    }
  }

  getTotalItems(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
