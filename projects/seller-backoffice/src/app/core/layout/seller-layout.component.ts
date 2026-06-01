import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { Logout } from '@seller-backoffice-core/services/logout.service';
import { UserService } from '@seller-backoffice-core/services/user.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-seller-layout',
  imports: [RouterOutlet, RouterLinkWithHref],
  providers: [ UserService, Logout ],
  template: `
    <!-- app.component.html -->
    <div class="flex h-screen bg-gray-100 font-sans">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col md:justify-between">
        <div class="p-6">
          <h1 class="text-2xl font-bold text-(--primary) tracking-tighter">Mainstream</h1>
          <h1 class="text-sm font-bold text-black/50 tracking-tighter">Live Streaming</h1>
        </div>
        <nav class="mt-6 h-[80vh]">
          <a [routerLink]="['/my-account/events']" routerLinkActive="bg-(--primary)/10 text-(--primary) border-r-4 border-(--primary)" class="flex items-center px-6 py-3 cursor-pointer text-gray-700 hover:bg-gray-50 transition-colors">
            <span class="mr-3 text-(--primary)">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-event"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M16 3l0 4" /><path d="M8 3l0 4" /><path d="M4 11l16 0" /><path d="M8 15h2v2h-2z" /></svg>
            </span>
            Eventos
          </a>
          <!-- <a routerLink="/streaming" routerLinkActive="bg-(--primary)/10 text-(--primary) border-r-4 border-(--primary)" class="flex items-center px-6 cursor-pointer py-3 text-gray-700 hover:bg-gray-50 transition-colors">
            <span class="mr-3">🎥</span> Live Stream
          </a> -->
        </nav>
        <div class="logou t p-6">
          <button (click)="logout()" class="flex items-center px-6 py-3 w-full rounded text-sm font-medium justify-center gap-3 cursor-pointer text-white bg-(--primary) transition-colors">
            @if(isLoggingOut()){
              <img class="w-5 h-5" src="/loader.svg" alt="">
            } @else {
              <span class="">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-logout-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" /><path d="M15 12h-12l3 -3" /><path d="M6 15l-3 -3" /></svg>
              </span>
              Terminar sessão
            }
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <header class="bg-white shadow-sm sticky top-0 z-10 h-16 flex items-center justify-between px-8">
          <h2 class="text-xl font-semibold text-gray-800">Painel do Anunciador</h2>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">{{ user()?.name }}</span>
            <div class="w-8 h-8 rounded-full bg-(--primary) flex items-center justify-center text-white text-xs">{{ user()?.name?.charAt(0) }}</div>
          </div>
        </header>
        
        <div class="p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: ``
})
export class SellerLayoutComponent {
  private userService = inject(UserService);
  private logoutService = inject(Logout);
  isLoggingOut = signal<boolean>(false);
  user = this.userService.user;

  logout(): void{
    if(this.isLoggingOut()) return;
    this.isLoggingOut.set(true);
    this.logoutService.logout().pipe(finalize(() => this.isLoggingOut.set(false))).subscribe({
      next: response => {
        if(response.status === HttpStatusCode.Accepted){
          this.userService.unAuthenticate();
        }
      },
      error: error => {
      }
    })
  }
}
