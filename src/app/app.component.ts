import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  template: `
    <app-navbar />
    <main class="app-main">
      <router-outlet />
    </main>
    <app-toast />
    <footer class="app-footer">
      <div class="container">
        <span>ساخته شده با ❤️ و Angular {{ ngVersion }} · </span>
        <a href="https://angular.dev" target="_blank" rel="noopener">angular.dev</a>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .app-main {
      flex: 1;
      display: block;
      padding: 24px 0 64px;
      animation: fadeIn 320ms var(--ease-out);
    }
    .app-footer {
      padding: 24px 0 32px;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
      border-top: 1px solid var(--border);
      background: var(--surface);
    }
    .app-footer a { font-weight: 600; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // Display Angular version from package.json (kept simple)
  readonly ngVersion = '18';
  // Touch the toast service so DI wires early (also ensures single instance).
  private readonly _toast = inject(ToastService);
}
