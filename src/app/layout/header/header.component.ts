import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, BadgeModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe(state => {
      this.currentUser = state.user;
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  navigateToAccount(): void {
    this.showUserMenu = false;
    this.router.navigate(['/dashboard/account']);
  }

  navigateToSettings(): void {
    this.showUserMenu = false;
    this.router.navigate(['/dashboard/settings/establishment']);
  }

  logout(): void {
    this.showUserMenu = false;
    
    this.confirmationService.confirm({
      message: 'Deseja realmente sair do sistema?',
      header: 'Confirmar Saída',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, sair',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.authService.logout();
      }
    });
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    
    const names = this.currentUser.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return this.currentUser.name.substring(0, 2).toUpperCase();
  }
}
