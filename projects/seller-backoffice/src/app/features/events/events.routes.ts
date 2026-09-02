import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/event-list.page').then(page => page.EventListPage),
        title: 'Eventos agendados para streaming'
    },
    {
        path: ':id/report',
        loadComponent: () => import('./pages/live-report.page').then(page => page.LiveReportPage),
        title: 'Relatório de Live Streaming - Studio'
    }
];