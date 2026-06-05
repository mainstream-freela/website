import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
      path: '',
      renderMode: RenderMode.Server
  },
  {
      path: 'about-us',
      renderMode: RenderMode.Server
  },
  {
      path: 'checkout',
      renderMode: RenderMode.Server
  },
  {
      path: 'faq',
      renderMode: RenderMode.Server
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
    renderMode: RenderMode.Server
  }
];
