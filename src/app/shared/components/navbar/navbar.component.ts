import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BookingsStore } from '../../../core/services/bookings.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <div class="container nav-inner">
        <a routerLink="/" class="brand" aria-label="خانه">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="3"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </span>
          <span class="brand-name">
            <strong>رزرو</strong>
            <em>سامانه رزرو آنلاین</em>
          </span>
        </a>

        <nav class="nav-links" aria-label="منوی اصلی">
          <a routerLink="/" [routerLinkActiveOptions]="{ exact: true }" routerLinkActive="active">خانه</a>
          <a routerLink="/book" routerLinkActive="active">رزرو جدید</a>
          <a routerLink="/bookings" routerLinkActive="active">
            رزروهای من
            @if (store.count() > 0) {
              <span class="count-pill">{{ store.count() }}</span>
            }
          </a>
          <a routerLink="/about" routerLinkActive="active">درباره</a>
        </nav>

        <a routerLink="/book" class="btn btn-primary nav-cta">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          رزرو سریع
        </a>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: saturate(180%) blur(16px);
      -webkit-backdrop-filter: saturate(180%) blur(16px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      height: 68px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text);
    }
    .brand-mark {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--brand-500), var(--accent-500));
      color: white;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
    }
    .brand-name {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }
    .brand-name strong { font-weight: 800; font-size: 1.05rem; }
    .brand-name em {
      font-style: normal;
      color: var(--text-muted);
      font-size: 0.78rem;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .nav-links a {
      position: relative;
      padding: 8px 14px;
      border-radius: var(--radius-md);
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.92rem;
      transition: all var(--dur-fast) var(--ease-out);

      &:hover {
        color: var(--text);
        background: var(--surface-2);
      }

      &.active {
        color: var(--brand-700);
        background: var(--brand-50);
      }
    }
    .count-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: var(--radius-full);
      background: var(--brand-500);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      margin-inline-start: 6px;
    }
    .nav-cta { padding: 8px 14px; }

    @media (max-width: 820px) {
      .nav-links { display: none; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  readonly store = inject(BookingsStore);
}
