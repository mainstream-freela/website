import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
      path: '',
      renderMode: RenderMode.Client
  },
  {
      path: 'about-us',
      renderMode: RenderMode.Client
  },
  {
      path: 'checkout',
      renderMode: RenderMode.Client
  },
  {
      path: 'faq',
      renderMode: RenderMode.Client
  },
  {
      path: 'create-account',
      renderMode: RenderMode.Prerender
  },
  {
      path: 'contact-us',
      renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
