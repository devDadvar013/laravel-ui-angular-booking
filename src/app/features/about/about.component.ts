import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container narrow">
      <header class="page-head">
        <span class="eyebrow">درباره سامانه</span>
        <h1>چطور این پروژه ساخته شده؟</h1>
        <p>این رابط کاربری، مصرف‌کننده‌ی API بک‌اند NestJS است که در پوشه <code>booking-system</code> قرار دارد.</p>
      </header>

      <article class="card block">
        <h3>معماری</h3>
        <ul>
          <li><strong>بک‌اند:</strong> NestJS + TypeORM + PostgreSQL + Redis (کش) + nodemailer (ایمیل) + Cron Job</li>
          <li><strong>فرانت‌اند:</strong> Angular 18 با standalone components، signals و reactive forms</li>
          <li><strong>استایل:</strong> SCSS با یک Design System اختصاصی (رنگ‌بندی Indigo + Violet، فونت Vazirmatn برای فارسی)</li>
        </ul>
      </article>

      <article class="card block">
        <h3>نقاط اتصال API</h3>
        <div class="endpoint">
          <span class="method post">POST</span>
          <code>/bookings</code>
          <span>ایجاد رزرو جدید</span>
        </div>
        <div class="endpoint">
          <span class="method get">GET</span>
          <code>/bookings/availability/:resourceId?date=YYYY-MM-DD</code>
          <span>دریافت رزروهای فعال یک منبع در یک روز</span>
        </div>
        <div class="endpoint">
          <span class="method get">GET</span>
          <code>/bookings/:id</code>
          <span>دریافت جزئیات یک رزرو</span>
        </div>
        <div class="endpoint">
          <span class="method patch">PATCH</span>
          <code>/bookings/:id/confirm</code>
          <span>تأیید نهایی رزرو PENDING</span>
        </div>
        <div class="endpoint">
          <span class="method patch">PATCH</span>
          <code>/bookings/:id/cancel</code>
          <span>لغو رزرو</span>
        </div>
      </article>

      <article class="card block">
        <h3>اجرا</h3>
        <p>برای اجرای کامل پروژه، ابتدا بک‌اند را بالا بیاورید:</p>
        <pre class="code"><code>cd booking-system
cp .env.example .env
docker run -d --name booking-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=booking_db -p 5432:5432 postgres:16
docker run -d --name booking-redis -p 6379:6379 redis:7
npm install
npm run start:dev</code></pre>
        <p>سپس این فرانت‌اند را اجرا کنید:</p>
        <pre class="code"><code>cd booking-ui
npm install
npm start</code></pre>
        <p>به‌صورت پیش‌فرض فرانت‌اند به <code>http://localhost:3000</code> وصل می‌شود. برای تغییر، فایل <code>src/environments/environment.development.ts</code> را ویرایش کنید.</p>
        <a routerLink="/book" class="btn btn-primary" style="margin-top: 12px">همین حالا رزرو کن</a>
      </article>
    </div>
  `,
  styles: [`
    .narrow { max-width: 760px; }
    .page-head { padding: 12px 0 24px; }
    .eyebrow {
      display: inline-block;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--brand-600);
      background: var(--brand-50);
      padding: 4px 10px;
      border-radius: var(--radius-full);
    }
    .page-head h1 { margin: 8px 0 6px; }
    .page-head p { color: var(--text-muted); }
    code {
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      background: var(--neutral-100);
      padding: 2px 6px;
      border-radius: 6px;
      font-size: 0.88em;
      direction: ltr;
      display: inline-block;
    }
    .block { padding: 22px; margin-bottom: 14px; }
    .block h3 { margin-bottom: 10px; }
    .block ul { padding-inline-start: 22px; color: var(--text-muted); }
    .block li { margin: 4px 0; }
    .block strong { color: var(--text); }

    .endpoint {
      display: grid;
      grid-template-columns: 60px 1fr;
      align-items: center;
      gap: 8px 12px;
      padding: 8px 0;
      border-bottom: 1px dashed var(--border);
      font-size: 0.92rem;
    }
    .endpoint:last-child { border-bottom: none; }
    .endpoint code { justify-self: start; }
    .method {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      color: white;
    }
    .method.post  { background: var(--success-500); }
    .method.get   { background: var(--brand-500); }
    .method.patch { background: var(--warning-500); }

    .code {
      background: #0f172a;
      color: #e2e8f0;
      padding: 14px 16px;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      overflow-x: auto;
      direction: ltr;
      text-align: left;
      margin: 8px 0;
    }
    .code code {
      background: transparent;
      color: inherit;
      padding: 0;
      font-size: inherit;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
