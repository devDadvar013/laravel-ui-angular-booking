import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { ToastService } from '../services/toast.service';

function humanize(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت و در دسترس بودن بک‌اند را بررسی کنید.';
  }
  const body = error.error as { message?: string | string[] } | undefined;
  if (body?.message) {
    return Array.isArray(body.message) ? body.message.join('، ') : body.message;
  }
  if (error.status >= 500) return 'خطای داخلی سرور. کمی بعد دوباره تلاش کنید.';
  if (error.status === 404) return 'موردی یافت نشد.';
  if (error.status === 400) return 'درخواست نامعتبر است.';
  return `خطا ${error.status} در برقراری ارتباط`;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Don't show toast for explicit cancellations; otherwise notify.
      const isAbort = err.status === 0 && err.statusText === 'Unknown Error' && !err.error;
      if (!isAbort) {
        toast.error(humanize(err));
      }
      return throwError(() => err);
    }),
  );
};
