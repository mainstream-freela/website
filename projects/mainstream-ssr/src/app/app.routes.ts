import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/components/container/home.component').then(component => component.HomeComponent),
        title: 'Mainstream - Página inicial'
    },
    {
        path: 'about-us',
        loadComponent: () => import('./pages/about-us/components/container/about-us.component').then(component => component.AboutUsComponent),
        title: 'Saiba tudo sobre nós - Mainstream',
    },
    {
        path: 'events',
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/events/components/container/events.component').then(component => component.EventsComponent),
                title: 'Acompanhe todos os eventos',
            },
            {
                path: 'category',
                children: [
                    {
                        path: '',
                        redirectTo: '/events',
                        pathMatch: 'full'
                    },
                    {
                        path: ':category',
                        loadComponent: () => import('./pages/events/components/container/events.component').then(component => component.EventsComponent),
                        title: 'Acompanhe todos os eventos desta categoria',
                    }
                ]
            },
            {
                path: 'details',
                children: [
                    {
                        path: '',
                        redirectTo: '/events',
                        pathMatch: 'full'
                    },
                    {
                        path: ':event',
                        loadComponent: () => import('./pages/event-details/components/container/event-details.component').then(component => component.EventDetailsComponent),
                        title: 'Detalhes do evento'
                    }
                ]
            },
            {
                path: 'search-results',
                loadComponent: () => import('./pages/search-result/components/container/search-result.component').then(component => component.SearchResultComponent),
                title: 'Resultados de pesquisa'
            }
        ],
    },
    {
        path: 'lives',
        children: [
            {
                path: 'access',
                title: 'Bem-vindo à Experiência ao Vivo',
                loadComponent: () => import('./pages/lives/views/live-access.component').then(component => component.LiveAccessComponent)
            },
            {
                path: 'watch',
                title: 'Sala de eventos ao Vivo',
                loadComponent: () => import('./pages/lives/views/watch.component').then(component => component.WatchComponent)
            }
        ]
    },
    {
        path: 'checkout',
        loadComponent: () => import('./pages/checkout/components/container/checkout.component').then(component => component.CheckoutComponent),
        title: 'Finalize a sua compra',
    },
    {
        path: 'faq',
        loadComponent: () => import('./pages/faq/components/container/faq.component').then(component => component.FaqComponent),
        title: 'Perguntas frequentes'
    },
    {
        path: 'create-account',
        loadComponent: () => import('./pages/create-account/components/container/create-account.component').then(component => component.CreateAccountComponent),
        title: 'Crie a sua conta e venda connosco',
    },
    {
        path: 'contact-us',
        loadComponent: () => import('./pages/contact-us/components/container/contact-us.component').then(component => component.ContactUsComponent),
        title: 'Entre em contacto connosco'
    },
    {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full'
    }
];
