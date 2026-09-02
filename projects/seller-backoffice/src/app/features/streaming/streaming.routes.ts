import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/streaming.page').then(page => page.StreamingPage),
        title: 'Evento ao vivo',
        canDeactivate: [
            (component: any) => component.canDeactivate ? component.canDeactivate() : true
        ]
    }
];