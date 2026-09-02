import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { EventFacade } from '../events.facade';
import { eventsProviders } from '../events.providers';
import { Event } from '../events.models';
import { EventsData } from '../events.data';
import { StreamService } from '@seller-backoffice-core/services/stream.service';
import { UserService } from '@seller-backoffice-core/services/user.service';
import { PopUp, PopupStatus } from '@seller-backoffice-core/libs/popup/popup.service';
import { HttpStatusCode } from '@angular/common/http';
import { AgoraIOService } from '@seller-backoffice-core/services/agora.service';

@Component({
  selector: 'app-event-list',
  imports: [ RouterLink ],
  providers: [ ...eventsProviders() ],
  template: `
    <!-- events.component.html -->
<div class="flex justify-between items-center mb-8">
  <h1 class="text-2xl font-bold text-gray-900">Seus Eventos</h1>
  <!-- <button class="bg-(--primary) hover:bg-(--primary)-dark text-white px-4 py-2 rounded-lg transition-colors font-medium">
    + Novo Evento
  </button> -->
</div>

@if(!isLoading()){
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    @for (event of events(); track $index) {
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 group">
        <div class="relative h-[24.75rem] overflow-hidden">
          <img [src]="event.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <div class="absolute top-2 right-2 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded backdrop-blur-md"
            [class.bg-red-600]="event.live?.is_live"
            [class.bg-gray-700]="event.live?.ended_at"
            [class.bg-blue-600]="!event.live">
            @if (event.live?.is_live) {
              AO VIVO
            } @else if (event.live?.ended_at) {
              TERMINADO
            } @else {
              AGENDADO
            }
          </div>
        </div>
        
        <div class="p-5">
          <p class="text-sm text-(--primary) font-medium mb-1">{{ event.formatted_date + ' às ' + event.time }}</p>
          <h3 class="text-lg font-bold text-gray-900 mb-4">{{ event.title }}</h3>
          
          @if (event.live?.ended_at) {
            <a 
              [routerLink]="['/my-account/events', event.uuid, 'report']"
              class="w-full bg-gray-950 hover:bg-black text-center cursor-pointer text-white py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold shadow-lg text-xs uppercase tracking-wider">
              📊 Ver Relatório da Live
            </a>
          } @else {
            <button 
              (click)="startLive(event, $index)"
              class="w-full bg-(--primary) cursor-pointer text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-(--primary)-dark transition-all font-semibold shadow-lg shadow-(--primary)/20 text-xs uppercase tracking-wider">
              @if(isStartingLive() && index() === $index){
                <img class="w-5 h-5" src="/loader.svg" alt="">
              } @else {
                <span>▶</span> {{ event.live?.is_live ? 'Reentrar na Live' : 'Iniciar Live' }}
              }
            </button>
          }
        </div>
      </div>
    } @empty {
      No data to display
    }
  </div>
} @else {
  A carregar...
}

<!-- SEÇÃO DE PAGINAÇÃO -->
<div class="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-4 mt-14 pb-12 gap-4">
  <!-- Info de Resultados -->
  <div class="text-sm text-gray-600">
    Mostrando <span class="font-semibold text-gray-900">{{ from() }}</span> à <span class="font-semibold text-gray-900">{{ to() }}</span> de <span class="font-semibold text-gray-900">{{ totalResults() }}</span> eventos
  </div>

  <!-- Controles de Navegação -->
  <nav class="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
    @if (isPrevEnabled()) {
      <!-- Botão Anterior -->
      <button 
        (click)="changePage(currentPage() - 1)"
        [disabled]="currentPage() === 1"
        class="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed">
        <span class="sr-only">Anterior</span>
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01.02 1.06L8.832 10l3.978 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
        </svg>
      </button>
    }

    <!-- Números das Páginas -->
     @for (link of links(); track $index) {
      @if(link.label !== 'pagination.previous' && link.label !== 'pagination.next' && link.label.indexOf('Previous') === -1 && link.label.indexOf('Next') === -1){
        <button 
          (click)="changePage(link.page)"
          [disabled]="!link.url"
          [class.bg-(--primary)]="link.active"
          [class.text-white]="link.active"
          [class.border-(--primary)]="link.active"
          [class.text-gray-700]="!link.active"
          class="relative cursor-pointer inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0 transition-colors">
          {{ link }}
        </button>
      }
     }

    @if (isNextEnabled()) {
      <!-- Botão Próximo -->
      <button
        (click)="changePage(currentPage() + 1)"
        class="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed">
        <span class="sr-only">Próximo</span>
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01-.02-1.06L11.168 10 7.19 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
        </svg>
      </button>
    }
  </nav>
</div>
  `,
  styles: ``
})
export class EventListPage implements OnInit {

  private eventFacade = inject(EventFacade);
  private eventsData = inject(EventsData);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private streamService = inject(StreamService);
  private userService = inject(UserService);
  private alertService = inject(PopUp);
  private agoraService = inject(AgoraIOService);

  currentPage = signal<number>(1);
  totalResults = signal<number>(0);
  from = signal<number>(0);
  to = signal<number>(0);
  links = signal<PaginationLink[]>([]);
  index = signal<number>(-1);
  isStartingLive = signal<boolean>(false);

  isNextEnabled = signal<boolean>(false);
  isPrevEnabled = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  events = signal<Event[]>([]);

  ngOnInit(): void {
    this.eventsData.clear();
    this.activatedRoute.queryParamMap.subscribe(queryParams => {
      const page = queryParams.get('page') ?? '1';
      this.getEvents(parseInt(page));
    });
  }

  getEvents(page: number): void{
    this.isLoading.set(true);
    this.eventFacade.eventsWithStreaming(page).subscribe({
      next: response => {
        this.events.set(response.data)
        this.isPrevEnabled.set(response.prev_page_url ? true : false);
        this.isPrevEnabled.set(response.next_page_url ? true : false);
        this.totalResults.set(response.total)
        this.from.set(response.from);
        this.to.set(response.to);

        this.isLoading.set(false);

        // Check if we should automatically start live for a specific event
        const startLiveUuid = this.activatedRoute.snapshot.queryParamMap.get('start_live');
        if (startLiveUuid) {
          const index = this.events().findIndex(e => e.uuid === startLiveUuid);
          if (index !== -1) {
            // Remove the start_live query parameter to prevent loop triggers on page reload
            this.router.navigate([], {
              relativeTo: this.activatedRoute,
              queryParams: { start_live: null },
              queryParamsHandling: 'merge',
              replaceUrl: true
            });

            // Automatically trigger startLive
            this.startLive(this.events()[index], index);
          }
        }
      },
      error: error => {
        this.isLoading.set(false);
      }
    })
  }

  changePage(page: any) {
    if (!page) return;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: page },
      queryParamsHandling: 'merge'
    });
  }

  startLive(event: Event, index: number): void{
    if(this.isStartingLive()) return;

    this.isStartingLive.set(true);
    this.index.set(index);
    this.streamService.startAndJoin(this.userService.user()!.email, event).subscribe({
      next: response => {
        if(!(this.streamService.eventInLive().length > 0)) return;
        this.agoraService.agoraUId = response.uid;
        this.agoraService.channelName = response.channel;
        this.agoraService.token = response.token;
        this.isStartingLive.set(false);

        this.router.navigate([ '/my-account/streaming' ])
      },
      error: error => {
        this.isStartingLive.set(false);
      }
    });
  }

}

interface PaginationLink{
  url: string | null,
  label: string,
  page: number | null,
  active: boolean
}