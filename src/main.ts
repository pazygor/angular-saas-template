import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

// Adicionar configuração do PrimeNG ao appConfig
const configWithPrimeNG = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    providePrimeNG({
      theme: {
        preset: Lara,
        options: {
          darkModeSelector: false,
          cssLayer: false
        }
      }
    })
  ]
};

bootstrapApplication(AppComponent, configWithPrimeNG)
  .catch(err => console.error(err));

