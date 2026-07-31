import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BookingsStore } from '../../core/services/bookings.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-text">
          <span class="eyebrow">
            <span class="dot"></span>
            سیستم رزرواسیون آنلاین
          </span>
          <h1>
            رزرو <span class="grad">بدون تداخل</span><br/>
            در چند ثانیه
          </h1>
          <p class="lede">
            با این سامانه می‌توانید منابع قابل رزرو (اتاق، میز، سالن و ...) را
            در تاریخ و ساعت دلخواه انتخاب و رزرو کنید. تمام مراحل با تضمین
            «عدم تداخل زمانی» انجام می‌شود.
          </p>
          <div class="cta-row">
            <a routerLink="/book" class="btn btn-primary btn-lg">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              شروع رزرو
            </a>
            <a routerLink="/bookings" class="btn btn-secondary btn-lg">رزروهای من</a>
          </div>
          <div class="stats">
            <div class="stat">
              <strong>{{ store.count() }}</strong>
              <span>رزرو فعال شما</span>
            </div>
            <div class="stat">
              <strong>24/7</strong>
              <span>دسترسی به سامانه</span>
            </div>
            <div class="stat">
              <strong>0</strong>
              <span>تداخل زمانی</span>
            </div>
          </div>
        </div>

        <div class="hero-card-stack" aria-hidden="true">
          <div class="card-glass hero-card-1">
            <div class="row">
              <span class="dot success"></span>
              <span>رزرو تأیید شد</span>
            </div>
            <strong>اتاق کنفرانس</strong>
            <span class="muted">۱۰:۰۰ — ۱۱:۰۰</span>
          </div>
          <div class="card-glass hero-card-2">
            <div class="row">
              <span class="dot warning"></span>
              <span>در انتظار تأیید</span>
            </div>
            <strong>میز شماره ۳</strong>
            <span class="muted">۱۴:۰۰ — ۱۵:۰۰</span>
          </div>
          <div class="card-glass hero-card-3">
            <div class="row">
              <span class="dot brand"></span>
              <span>زمان آزاد</span>
            </div>
            <strong>سالن جلسات</strong>
            <span class="muted">۰۹:۰۰ — ۱۰:۰۰</span>
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <div class="section-title">ویژگی‌ها</div>
        <div class="grid">
          <article class="card feat">
            <div class="ico" data-tone="brand">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3>بدون تداخل زمانی</h3>
            <p>تمام رزروها در تراکنشی ایمن با سطح ایزوله‌سازی بالا ثبت می‌شوند تا هیچ دو رزروی هم‌پوشانی نداشته باشند.</p>
          </article>

          <article class="card feat">
            <div class="ico" data-tone="success">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/>
              </svg>
            </div>
            <h3>تأیید سریع</h3>
            <p>پس از ثبت، تنها با یک کلیک رزرو خود را نهایی کنید. رزروهای تأییدنشده پس از مهلت مشخص به‌صورت خودکار آزاد می‌شوند.</p>
          </article>

          <article class="card feat">
            <div class="ico" data-tone="warning">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3>کش هوشمند</h3>
            <p>برای سرعت بیشتر، نتایج دسترسی‌پذیری در کش ذخیره می‌شوند؛ با هر تغییر، کش به‌صورت خودکار باطل می‌شود.</p>
          </article>

          <article class="card feat">
            <div class="ico" data-tone="danger">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/>
              </svg>
            </div>
            <h3>ایمیل تأیید</h3>
            <p>به‌محض ثبت رزرو، ایمیل تأیید برای شما ارسال می‌شود تا خیالتان از بابت ثبت نهایی راحت باشد.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="how">
      <div class="container">
        <div class="section-title">چطور کار می‌کند؟</div>
        <ol class="steps">
          <li>
            <span class="num num-en">1</span>
            <h3>منبع و تاریخ را انتخاب کنید</h3>
            <p>از لیست منابع، مورد دلخواه و روز مورد نظر را انتخاب کنید.</p>
          </li>
          <li>
            <span class="num num-en">2</span>
            <h3>بازه زمانی آزاد را برگزینید</h3>
            <p>ساعت‌های آزاد به‌صورت بصری نمایش داده می‌شوند. فقط با یک کلیک انتخاب کنید.</p>
          </li>
          <li>
            <span class="num num-en">3</span>
            <h3>رزرو را ثبت و تأیید کنید</h3>
            <p>نام و ایمیل خود را وارد کنید. سپس رزرو در وضعیت «در انتظار» قرار می‌گیرد. با تأیید نهایی، رزرو شما نهایی می‌شود.</p>
          </li>
        </ol>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      padding: 56px 0 32px;
    }
    .hero-inner {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 48px;
      align-items: center;
    }
    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: var(--radius-full);
      background: var(--brand-50);
      color: var(--brand-700);
      font-size: 0.82rem;
      font-weight: 700;
    }
    .eyebrow .dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--brand-500);
      box-shadow: 0 0 0 4px color-mix(in oklab, var(--brand-500) 30%, transparent);
    }
    .grad {
      background: linear-gradient(135deg, var(--brand-600), var(--accent-500));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .lede {
      color: var(--text-muted);
      font-size: 1.05rem;
      max-width: 540px;
      margin: 16px 0 24px;
    }
    .cta-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .stats {
      display: flex;
      gap: 24px;
      margin-top: 36px;
      flex-wrap: wrap;
    }
    .stat strong {
      display: block;
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text);
      line-height: 1.1;
    }
    .stat span {
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    .hero-card-stack {
      position: relative;
      height: 420px;
    }
    .hero-card-stack > div {
      position: absolute;
      padding: 18px;
      width: 240px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .hero-card-stack strong { font-size: 1.05rem; }
    .hero-card-stack .muted { color: var(--text-muted); font-size: 0.85rem; }
    .hero-card-stack .row {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--text-muted); font-size: 0.82rem; font-weight: 600;
    }
    .hero-card-stack .dot {
      width: 8px; height: 8px; border-radius: 50%;
    }
    .hero-card-stack .dot.success { background: var(--success-500); }
    .hero-card-stack .dot.warning { background: var(--warning-500); }
    .hero-card-stack .dot.brand { background: var(--brand-500); }
    .hero-card-1 { top: 30px; right: 60px; transform: rotate(-3deg); }
    .hero-card-2 { top: 150px; right: 0; transform: rotate(2deg); }
    .hero-card-3 { top: 270px; right: 100px; transform: rotate(-1deg); }

    .features { padding: 56px 0 24px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
    .feat { display: flex; flex-direction: column; gap: 8px; }
    .feat p { color: var(--text-muted); font-size: 0.92rem; }
    .ico {
      width: 40px; height: 40px;
      border-radius: var(--radius-md);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }
    .ico[data-tone="brand"]   { background: var(--brand-50);   color: var(--brand-600); }
    .ico[data-tone="success"] { background: var(--success-50); color: var(--success-600); }
    .ico[data-tone="warning"] { background: var(--warning-50); color: var(--warning-600); }
    .ico[data-tone="danger"]  { background: var(--danger-50);  color: var(--danger-600); }

    .how { padding: 56px 0; }
    .steps {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }
    .steps li {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 22px;
      position: relative;
    }
    .steps h3 { margin-bottom: 6px; }
    .steps p { color: var(--text-muted); font-size: 0.92rem; }
    .num {
      position: absolute;
      top: -14px;
      inset-inline-end: -14px;
      width: 40px; height: 40px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--brand-500), var(--accent-500));
      color: white;
      font-weight: 800;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
    }

    @media (max-width: 880px) {
      .hero-inner { grid-template-columns: 1fr; }
      .hero-card-stack { display: none; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly store = inject(BookingsStore);
}
