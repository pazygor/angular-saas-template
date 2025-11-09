# 📝 Guia: Formulários e Validação

Guia completo para criar formulários reativos no ClimbDelivery com validação robusta.

## 🎯 Abordagem: Reactive Forms

ClimbDelivery usa **Reactive Forms** (não Template-driven) para:
- Validação programática mais poderosa
- Testes mais fáceis
- Controle total sobre estado do formulário
- Validações assíncronas (API)
- Reatividade com RxJS

## 📦 Imports Necessários

```typescript
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
```

## 🏗️ Estrutura Básica

### Template HTML

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div class="field">
    <label for="campo">Label *</label>
    <input 
      id="campo"
      type="text" 
      pInputText 
      formControlName="campo"
      [class.ng-invalid]="form.get('campo')?.invalid && form.get('campo')?.touched" />
    
    <!-- Mensagens de erro -->
    <small 
      *ngIf="form.get('campo')?.hasError('required') && form.get('campo')?.touched"
      class="p-error">
      Campo obrigatório
    </small>
  </div>

  <button 
    type="submit" 
    pButton 
    label="Salvar"
    [disabled]="form.invalid || isSubmitting"
    [loading]="isSubmitting">
  </button>
</form>
```

### Component TypeScript

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class MeuFormComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      campo: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitting = true;
      const formData = this.form.value;
      // Enviar dados...
    }
  }
}
```

## 🔒 Validadores Built-in

### Validators Comuns

```typescript
this.form = this.fb.group({
  // Obrigatório
  nome: ['', Validators.required],

  // Tamanho mínimo/máximo
  senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],

  // Email
  email: ['', [Validators.required, Validators.email]],

  // Padrão (regex)
  telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],

  // Valor mínimo/máximo
  idade: [0, [Validators.min(18), Validators.max(120)]],

  // Múltiplos validadores
  cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
});
```

## 🎨 Exemplo Completo: Formulário de Cliente

### cliente-form.component.ts

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';

// Services & Models
import { ClienteService } from '../../../../core/services/cliente.service';
import { Cliente, ClienteCreateDto } from '../../models/cliente.model';

// Validators
import { CustomValidators } from '../../../../shared/validators/custom-validators';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    CardModule,
    ToastModule,
    CheckboxModule
  ],
  providers: [MessageService],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  clienteId?: string;

  estados = [
    { label: 'São Paulo', value: 'SP' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Minas Gerais', value: 'MG' },
    // ... outros estados
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      cpf: ['', [Validators.required, CustomValidators.cpf]],
      ativo: [true],
      endereco: this.fb.group({
        rua: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]],
        cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]]
      })
    });
  }

  checkEditMode(): void {
    this.clienteId = this.route.snapshot.paramMap.get('id') || undefined;
    
    if (this.clienteId) {
      this.isEditMode = true;
      this.loadCliente();
    }
  }

  loadCliente(): void {
    if (!this.clienteId) return;

    this.clienteService.getClienteById(this.clienteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cliente) => {
          this.form.patchValue(cliente);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar cliente'
          });
          this.router.navigate(['/dashboard/clientes']);
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      return;
    }

    this.isSubmitting = true;
    const formData = this.form.value;

    const request$ = this.isEditMode && this.clienteId
      ? this.clienteService.updateCliente(this.clienteId, formData)
      : this.clienteService.createCliente(formData);

    request$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Cliente ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso`
          });
          
          setTimeout(() => {
            this.router.navigate(['/dashboard/clientes']);
          }, 1500);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Falha ao ${this.isEditMode ? 'atualizar' : 'criar'} cliente`
          });
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/clientes']);
  }

  // Helpers
  getFieldError(fieldName: string): string | null {
    const field = this.form.get(fieldName);
    
    if (!field || !field.errors || !field.touched) {
      return null;
    }

    if (field.hasError('required')) {
      return 'Campo obrigatório';
    }
    
    if (field.hasError('email')) {
      return 'Email inválido';
    }
    
    if (field.hasError('minlength')) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }
    
    if (field.hasError('maxlength')) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `Máximo de ${maxLength} caracteres`;
    }
    
    if (field.hasError('pattern')) {
      return 'Formato inválido';
    }

    if (field.hasError('cpfInvalid')) {
      return 'CPF inválido';
    }

    return 'Campo inválido';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
```

### cliente-form.component.html

```html
<div class="cliente-form">
  <div class="flex justify-content-between align-items-center mb-4">
    <h2 class="text-3xl font-semibold m-0">
      {{ isEditMode ? 'Editar Cliente' : 'Novo Cliente' }}
    </h2>
  </div>

  <form [formGroup]="form" (ngSubmit)="onSubmit()">
    <p-card>
      <ng-template pTemplate="header">
        <div class="p-3">
          <h3 class="m-0">Dados Pessoais</h3>
        </div>
      </ng-template>

      <div class="grid">
        <!-- Nome -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="nome">Nome Completo *</label>
            <input 
              id="nome"
              type="text" 
              pInputText 
              formControlName="nome"
              placeholder="Digite o nome completo"
              class="w-full"
              [class.ng-invalid]="form.get('nome')?.invalid && form.get('nome')?.touched" />
            
            <small 
              *ngIf="getFieldError('nome')"
              class="p-error block mt-1">
              {{ getFieldError('nome') }}
            </small>
          </div>
        </div>

        <!-- Email -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="email">Email *</label>
            <input 
              id="email"
              type="email" 
              pInputText 
              formControlName="email"
              placeholder="email@exemplo.com"
              class="w-full"
              [class.ng-invalid]="form.get('email')?.invalid && form.get('email')?.touched" />
            
            <small 
              *ngIf="getFieldError('email')"
              class="p-error block mt-1">
              {{ getFieldError('email') }}
            </small>
          </div>
        </div>

        <!-- Telefone -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="telefone">Telefone *</label>
            <p-inputMask 
              id="telefone"
              mask="(99) 99999-9999"
              formControlName="telefone"
              placeholder="(00) 00000-0000"
              styleClass="w-full"
              [class.ng-invalid]="form.get('telefone')?.invalid && form.get('telefone')?.touched">
            </p-inputMask>
            
            <small 
              *ngIf="getFieldError('telefone')"
              class="p-error block mt-1">
              {{ getFieldError('telefone') }}
            </small>
          </div>
        </div>

        <!-- CPF -->
        <div class="col-12 md:col-6">
          <div class="field">
            <label for="cpf">CPF *</label>
            <p-inputMask 
              id="cpf"
              mask="999.999.999-99"
              formControlName="cpf"
              placeholder="000.000.000-00"
              styleClass="w-full"
              [class.ng-invalid]="form.get('cpf')?.invalid && form.get('cpf')?.touched">
            </p-inputMask>
            
            <small 
              *ngIf="getFieldError('cpf')"
              class="p-error block mt-1">
              {{ getFieldError('cpf') }}
            </small>
          </div>
        </div>

        <!-- Ativo -->
        <div class="col-12">
          <div class="field-checkbox">
            <p-checkbox 
              id="ativo"
              formControlName="ativo"
              [binary]="true">
            </p-checkbox>
            <label for="ativo" class="ml-2">Cliente ativo</label>
          </div>
        </div>
      </div>
    </p-card>

    <!-- Endereço -->
    <p-card class="mt-3">
      <ng-template pTemplate="header">
        <div class="p-3">
          <h3 class="m-0">Endereço</h3>
        </div>
      </ng-template>

      <div formGroupName="endereco" class="grid">
        <!-- CEP -->
        <div class="col-12 md:col-4">
          <div class="field">
            <label for="cep">CEP *</label>
            <p-inputMask 
              id="cep"
              mask="99999-999"
              formControlName="cep"
              placeholder="00000-000"
              styleClass="w-full">
            </p-inputMask>
            
            <small 
              *ngIf="getFieldError('endereco.cep')"
              class="p-error block mt-1">
              {{ getFieldError('endereco.cep') }}
            </small>
          </div>
        </div>

        <!-- Rua -->
        <div class="col-12 md:col-8">
          <div class="field">
            <label for="rua">Rua *</label>
            <input 
              id="rua"
              type="text" 
              pInputText 
              formControlName="rua"
              class="w-full" />
            
            <small 
              *ngIf="getFieldError('endereco.rua')"
              class="p-error block mt-1">
              {{ getFieldError('endereco.rua') }}
            </small>
          </div>
        </div>

        <!-- Número -->
        <div class="col-12 md:col-3">
          <div class="field">
            <label for="numero">Número *</label>
            <input 
              id="numero"
              type="text" 
              pInputText 
              formControlName="numero"
              class="w-full" />
            
            <small 
              *ngIf="getFieldError('endereco.numero')"
              class="p-error block mt-1">
              {{ getFieldError('endereco.numero') }}
            </small>
          </div>
        </div>

        <!-- Complemento -->
        <div class="col-12 md:col-5">
          <div class="field">
            <label for="complemento">Complemento</label>
            <input 
              id="complemento"
              type="text" 
              pInputText 
              formControlName="complemento"
              class="w-full" />
          </div>
        </div>

        <!-- Bairro -->
        <div class="col-12 md:col-4">
          <div class="field">
            <label for="bairro">Bairro *</label>
            <input 
              id="bairro"
              type="text" 
              pInputText 
              formControlName="bairro"
              class="w-full" />
            
            <small 
              *ngIf="getFieldError('endereco.bairro')"
              class="p-error block mt-1">
              {{ getFieldError('endereco.bairro') }}
            </small>
          </div>
        </div>

        <!-- Cidade -->
        <div class="col-12 md:col-5">
          <div class="field">
            <label for="cidade">Cidade *</label>
            <input 
              id="cidade"
              type="text" 
              pInputText 
              formControlName="cidade"
              class="w-full" />
            
            <small 
              *ngIf="getFieldError('endereco.cidade')"
              class="p-error block mt-1">
              {{ getFieldError('endereco.cidade') }}
            </small>
          </div>
        </div>

        <!-- Estado -->
        <div class="col-12 md:col-3">
          <div class="field">
            <label for="estado">Estado *</label>
            <p-dropdown
              id="estado"
              [options]="estados"
              formControlName="estado"
              placeholder="Selecione"
              styleClass="w-full">
            </p-dropdown>
            
            <small 
              *ngIf="getFieldError('endereco.estado')"
              class="p-error block mt-1">
              {{ getFieldError('endereco.estado') }}
            </small>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex gap-2 justify-content-end">
          <button 
            type="button"
            pButton 
            label="Cancelar" 
            icon="pi pi-times"
            class="p-button-outlined"
            (click)="onCancel()"
            [disabled]="isSubmitting">
          </button>
          <button 
            type="submit"
            pButton 
            [label]="isEditMode ? 'Atualizar' : 'Salvar'" 
            icon="pi pi-check"
            [disabled]="form.invalid || isSubmitting"
            [loading]="isSubmitting">
          </button>
        </div>
      </ng-template>
    </p-card>
  </form>
</div>

<p-toast></p-toast>
```

### cliente-form.component.scss

```scss
:host {
  display: block;
  padding: 1.5rem;
}

.cliente-form {
  max-width: 1200px;
  margin: 0 auto;
}

.field {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color);
  }
}

.field-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
}
```

## 🔧 Validadores Customizados

### shared/validators/custom-validators.ts

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // CPF Validator
  static cpf(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value?.replace(/\D/g, '');

    if (!cpf || cpf.length !== 11) {
      return { cpfInvalid: true };
    }

    // Validação do CPF
    let sum = 0;
    let remainder;

    // Verifica se todos dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
      return { cpfInvalid: true };
    }

    // Valida 1º dígito
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return { cpfInvalid: true };
    }

    // Valida 2º dígito
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return { cpfInvalid: true };
    }

    return null;
  }

  // CNPJ Validator
  static cnpj(control: AbstractControl): ValidationErrors | null {
    const cnpj = control.value?.replace(/\D/g, '');

    if (!cnpj || cnpj.length !== 14) {
      return { cnpjInvalid: true };
    }

    // Validação do CNPJ (implementação completa omitida por brevidade)
    // Similar ao CPF, com lógica específica

    return null;
  }

  // Senha forte
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasNumber && hasUpper && hasLower && hasSpecial;

    if (!valid) {
      return { weakPassword: true };
    }

    return null;
  }

  // Confirmar senha
  static matchPassword(passwordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.parent?.get(passwordField)?.value;
      const confirmPassword = control.value;

      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  // Validar URL
  static url(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    try {
      new URL(value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  }

  // Telefone brasileiro
  static telefone(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.replace(/\D/g, '');

    if (!value) {
      return null;
    }

    // (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    const valid = /^(\d{2})(\d{4,5})(\d{4})$/.test(value);

    if (!valid) {
      return { telefoneInvalid: true };
    }

    return null;
  }
}
```

### Uso dos Validators Customizados

```typescript
this.form = this.fb.group({
  cpf: ['', [Validators.required, CustomValidators.cpf]],
  senha: ['', [Validators.required, Validators.minLength(8), CustomValidators.strongPassword]],
  confirmarSenha: ['', [Validators.required, CustomValidators.matchPassword('senha')]],
  website: ['', [CustomValidators.url]],
  telefone: ['', [Validators.required, CustomValidators.telefone]]
});
```

## 🔄 Validação Assíncrona

Para validar com API (ex: email único):

```typescript
import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

export class AsyncValidators {
  static emailUnico(clienteService: ClienteService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500), // Aguarda 500ms após parar de digitar
        switchMap(email => 
          clienteService.checkEmailExists(email).pipe(
            map(exists => exists ? { emailTaken: true } : null),
            catchError(() => of(null))
          )
        )
      );
    };
  }
}

// Uso
this.form = this.fb.group({
  email: [
    '',
    [Validators.required, Validators.email],
    [AsyncValidators.emailUnico(this.clienteService)] // 3º parâmetro
  ]
});
```

## ✅ Boas Práticas

### ✅ Fazer
- Usar FormBuilder para criar forms
- Marcar campos obrigatórios com *
- Mensagens de erro claras e específicas
- Validação on blur (touched)
- Desabilitar botão submit se form inválido
- Loading state durante submit
- FormGroup para campos aninhados (endereço)
- Validadores customizados reutilizáveis

### ❌ Evitar
- Template-driven forms (sem TypeScript)
- Validação apenas no backend
- Mensagens genéricas ("Campo inválido")
- Permitir submit de form inválido
- Não dar feedback visual (ng-invalid)
- Não limpar form após sucesso
- Múltiplos validates iguais copiados

## 📚 Componentes PrimeNG para Forms

```typescript
// Input básico
import { InputTextModule } from 'primeng/inputtext';

// Textarea
import { InputTextareaModule } from 'primeng/inputtextarea';

// Number
import { InputNumberModule } from 'primeng/inputnumber';

// Mask (telefone, CPF, CEP)
import { InputMaskModule } from 'primeng/inputmask';

// Dropdown/Select
import { DropdownModule } from 'primeng/dropdown';

// MultiSelect
import { MultiSelectModule } from 'primeng/multiselect';

// Checkbox
import { CheckboxModule } from 'primeng/checkbox';

// Radio Button
import { RadioButtonModule } from 'primeng/radiobutton';

// Calendar/Date
import { CalendarModule } from 'primeng/calendar';

// File Upload
import { FileUploadModule } from 'primeng/fileupload';

// Editor Rich Text
import { EditorModule } from 'primeng/editor';
```

## 🎨 CSS para Estados de Validação

```scss
// Global em styles.scss
.ng-invalid.ng-touched {
  border-color: var(--red-500) !important;
}

.ng-valid.ng-touched {
  border-color: var(--green-500) !important;
}

.p-error {
  color: var(--red-500);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.field {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-color);

    &:after {
      content: ' *';
      color: var(--red-500);
    }
  }
}
```

## 📋 Checklist de Validação

- [ ] FormBuilder configurado
- [ ] ReactiveFormsModule importado
- [ ] Validadores aplicados (required, email, pattern, etc.)
- [ ] Mensagens de erro para cada validador
- [ ] Estado visual (ng-invalid, ng-touched)
- [ ] Submit desabilitado se inválido
- [ ] Loading state durante submit
- [ ] Validadores customizados (CPF, senha forte)
- [ ] Validação assíncrona se necessário (email único)
- [ ] FormGroup para dados aninhados
- [ ] Máscaras aplicadas (telefone, CPF, CEP)
- [ ] Toast de sucesso/erro após submit
- [ ] Navegação após sucesso
