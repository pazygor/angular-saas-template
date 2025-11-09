# 📚 Documentação ClimbDelivery

Bem-vindo à documentação do projeto ClimbDelivery! Este diretório contém todos os padrões, convenções e guias de desenvolvimento do projeto.

## 📑 Índice de Documentos

### Padrões de Desenvolvimento
- [Estrutura do Projeto](./ESTRUTURA_PROJETO.md) - Organização de pastas e arquivos
- [Padrões de Componentes](./PADROES_COMPONENTES.md) - Como criar componentes standalone
- [Padrões de Estilos](./PADROES_ESTILOS.md) - PrimeNG, PrimeFlex e SCSS
- [Padrões de Telas](./PADROES_TELAS.md) - Layout e estrutura de páginas
- [Padrões de Roteamento](./PADROES_ROTEAMENTO.md) - Configuração de rotas e guards
- [Padrões de Serviços](./PADROES_SERVICOS.md) - Services, HTTP, interceptors e API

### Guias Práticos
- [Como Criar uma Nova Tela](./GUIA_NOVA_TELA.md) - Passo a passo completo
- [Formulários e Validação](./GUIA_FORMULARIOS.md) - Reactive Forms com validações
- [Gerenciamento de Estados](./GUIA_ESTADOS.md) - Loading, error, empty states

## 🚀 Stack Tecnológica

- **Angular 19.2.19** - Framework principal (standalone components)
- **PrimeNG 20.3.0** - Biblioteca de componentes UI
- **PrimeFlex 4.0.0** - Utilitários CSS responsivos
- **PrimeIcons 7.0.0** - Biblioteca de ícones
- **RxJS 7.8** - Programação reativa
- **TypeScript 5.7.2** - Linguagem
- **SCSS** - Pré-processador CSS

## 🎨 Design System

### Tema
- **Tema PrimeNG:** Lara (Light Blue)
- **Fonte:** Poppins (300, 400, 500, 600, 700)

### Cores Principais
```scss
--primary-color: #3B82F6;
--surface-ground: #f8fafc;
--text-color: #1e293b;
--text-color-secondary: #64748b;
```

## 📝 Convenções de Nomenclatura

### Arquivos
- Componentes: `nome-componente.component.ts`
- Services: `nome-service.service.ts`
- Models: `nome-model.model.ts`
- Guards: `nome.guard.ts`
- Interceptors: `nome.interceptor.ts`

### Classes e Interfaces
- Componentes: `PascalCase` (ex: `LoginComponent`)
- Services: `PascalCase` + `Service` (ex: `AuthService`)
- Interfaces: `PascalCase` (ex: `User`, `Order`)
- Enums: `PascalCase` (ex: `OrderStatus`)

### Variáveis e Métodos
- camelCase (ex: `currentUser`, `loadOrders()`)
- Observables terminam com `$` (ex: `authState$`)

## 🔐 Credenciais de Teste

**Email:** admin@climbdelivery.com  
**Senha:** admin123

## 📞 Suporte

Para dúvidas sobre os padrões ou estrutura do projeto, consulte os documentos específicos listados acima.
