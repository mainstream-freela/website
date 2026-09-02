import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login.page').then(page => page.LoginPage),
        title: 'Entrar na minha conta'
    },
    {
        path: 'sso',
        loadComponent: () => import('./pages/sso.page').then(page => page.SSOPage),
        title: 'Autenticação SSO'
    }
];