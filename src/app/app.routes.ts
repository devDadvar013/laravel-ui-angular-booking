import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'خانه · سامانه رزرو',
  },
  {
    path: 'book',
    loadComponent: () =>
      import('./features/book/book.component').then((m) => m.BookComponent),
    title: 'رزرو جدید',
  },
  {
    path: 'bookings',
    loadComponent: () =>
      import('./features/my-bookings/my-bookings.component').then(
        (m) => m.MyBookingsComponent,
      ),
    title: 'رزروهای من',
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./features/about/about.component').then((m) => m.AboutComponent),
    title: 'درباره سامانه',
  },
  { path: '**', redirectTo: '' },
];
