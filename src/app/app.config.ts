import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeFa from '@angular/common/locales/fa';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';

// بدون این خط، هر جای اپ که از DatePipe با locale «fa» استفاده شود
// خطای NG0701 (Missing locale data for the locale "fa") می‌دهد.
registerLocaleData(localeFa, 'fa');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideAnimations(),
  ],
};
