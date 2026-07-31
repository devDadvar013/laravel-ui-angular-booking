import { Pipe, PipeTransform } from '@angular/core';

/**
 * تاریخ را به تقویم جلالی/شمسی واقعی (نه فقط ترجمه‌ی فارسیِ تقویم میلادی) نمایش می‌دهد.
 * از Intl.DateTimeFormat خودِ مرورگر با calendar: persian استفاده می‌کند، بدون نیاز به
 * هیچ کتابخانه‌ی جانبی (jalali-moment و مانند آن).
 *
 * استفاده:
 *   {{ someDate | persianDate }}              → "پنجشنبه ۹ مرداد ۱۴۰۵"
 *   {{ someDate | persianDate: 'short' }}      → "۱۴۰۵/۵/۹"
 */
@Pipe({
  name: 'persianDate',
  standalone: true,
  pure: true,
})
export class PersianDatePipe implements PipeTransform {
  private static readonly fullFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  private static readonly shortFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  transform(value: Date | string | null | undefined, style: 'full' | 'short' = 'full'): string {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const formatter = style === 'short' ? PersianDatePipe.shortFormatter : PersianDatePipe.fullFormatter;
    return formatter.format(date);
  }
}
