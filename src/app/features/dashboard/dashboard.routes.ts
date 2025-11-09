import { Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { MenuComponent } from './menu/menu.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './account/account.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { ReportsComponent } from './reports/reports.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrdersComponent
  },
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path: 'menu/products',
    component: MenuComponent
  },
  {
    path: 'menu/categories',
    component: MenuComponent
  },
  {
    path: 'menu/extras',
    component: MenuComponent
  },
  {
    path: 'settings/establishment',
    component: SettingsComponent
  },
  {
    path: 'account',
    component: AccountComponent
  },
  {
    path: 'delivery',
    component: DeliveryComponent
  },
  {
    path: 'reports/orders',
    component: ReportsComponent
  }
];
