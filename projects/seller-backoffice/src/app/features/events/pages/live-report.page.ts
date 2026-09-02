import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventApiService } from '../events.api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-report',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  template: `
    <div class="p-6 max-w-full mx-auto space-y-8">
      
      <!-- HEADER & BACK BUTTON -->
      <div class="flex items-center gap-4">
        <a routerLink="/my-account/events" class="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-2xl flex items-center justify-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
        </a>
        <div>
          <h1 class="text-2xl font-black text-gray-900 uppercase tracking-tighter">Relatório de Live Streaming</h1>
          <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Analytics Pós-Live: {{ eventTitle() }}</p>
        </div>
      </div>

      @if(isLoading()){
        <div class="flex items-center justify-center py-20">
          <svg class="animate-spin h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      } @else if (errorMsg()) {
        <div class="bg-red-50 border border-red-200 rounded-3xl p-6 text-center text-red-800 space-y-2">
          <span class="text-3xl block">⚠️</span>
          <p class="font-bold">{{ errorMsg() }}</p>
          <a routerLink="/my-account/events" class="text-xs font-black uppercase text-red-600 hover:underline block pt-2">Voltar aos Eventos</a>
        </div>
      } @else {
        
        <!-- KEY METRICS CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- DURAÇÃO -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duração Total</span>
              <h3 class="text-xl font-black text-gray-900 mt-1">{{ kpis().duration_text || kpis().duration_formatted }}</h3>
            </div>
            <div class="bg-gray-50 text-gray-700 p-3 rounded-2xl text-xl">
              ⏱️
            </div>
          </div>

          <!-- PICO ESPECTADORES -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pico de Audiência</span>
              <h3 class="text-xl font-black text-gray-900 mt-1">{{ kpis().peak_concurrent_users }}</h3>
            </div>
            <div class="bg-blue-50 text-blue-600 p-3 rounded-2xl text-xl">
              📈
            </div>
          </div>

          <!-- TOTAL ESPECTADORES -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Espetadores Únicos</span>
              <h3 class="text-xl font-black text-gray-900 mt-1">{{ kpis().total_accumulated_users }}</h3>
            </div>
            <div class="bg-purple-50 text-purple-600 p-3 rounded-2xl text-xl">
              👥
            </div>
          </div>

          <!-- ESTABILIDADE -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estabilidade Média</span>
              <h3 class="text-xl font-black text-green-600 mt-1">{{ kpis().quality?.status }}</h3>
            </div>
            <div class="bg-green-50 text-green-600 p-3 rounded-2xl text-xl">
              🛡️
            </div>
          </div>

        </div>

        <!-- TABLE OF ATTENDEES -->
        <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              📋 Lista de Presenças e Acessos
            </h3>
            <span class="text-[10px] bg-gray-100 text-gray-500 font-bold px-3 py-1 rounded-full uppercase">
              {{ attendees().length }} registos
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-gray-100 text-gray-400 uppercase font-black tracking-wider">
                  <th class="pb-3">Participante / Função</th>
                  <th class="pb-3 text-center">ID da Conexão</th>
                  <th class="pb-3">Hora de Entrada</th>
                  <th class="pb-3">Hora de Saída</th>
                  <th class="pb-3 text-center">Tempo Assistido</th>
                  <th class="pb-3 text-center">Estabilidade</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                @for (user of attendees(); track $index) {
                  <tr class="text-gray-700 font-medium">
                    <td class="py-3.5">
                      <div class="flex flex-col gap-0.5">
                        <span class="font-bold text-gray-900">{{ user.role }}</span>
                        @if(user.connection_id === 'Organizador'){
                          <span class="text-[9px] text-red-500 font-bold uppercase">Host / Transmissor</span>
                        } @else {
                          <span class="text-[9px] text-gray-400 font-bold uppercase">Espetador</span>
                        }
                      </div>
                    </td>
                    
                    <td class="py-3.5 text-center font-mono text-gray-500">{{ user.connection_id }}</td>
                    <td class="py-3.5 text-gray-500">{{ user.joined_at }}</td>
                    <td class="py-3.5">
                      <span [class.text-green-600]="user.left_at === 'Ainda conectado'" [class.font-bold]="user.left_at === 'Ainda conectado'">
                        {{ user.left_at }}
                      </span>
                    </td>
                    <td class="py-3.5 text-center font-mono font-bold text-gray-900">{{ user.duration }}</td>
                    <td class="py-3.5 text-center">
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase"
                        [class.bg-green-50]="user.quality_status === 'Excelente'"
                        [class.text-green-600]="user.quality_status === 'Excelente'"
                        [class.bg-yellow-50]="user.quality_status === 'Instável'"
                        [class.text-yellow-600]="user.quality_status === 'Instável'">
                        {{ user.quality_status }}
                      </span>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="py-6 text-center text-gray-400">Nenhum registo de participação encontrado para este evento.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

      }

    </div>
  `,
  styles: ``
})
export class LiveReportPage implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(EventApiService);

  isLoading = signal<boolean>(true);
  errorMsg = signal<string>('');
  
  eventTitle = signal<string>('');
  kpis = signal<any>({});
  attendees = signal<any[]>([]);

  ngOnInit(): void {
    const eventUuid = this.route.snapshot.paramMap.get('id');
    if (eventUuid) {
      this.loadReport(eventUuid);
    } else {
      this.errorMsg.set('ID de evento inválido na rota.');
      this.isLoading.set(false);
    }
  }

  loadReport(uuid: string): void {
    this.api.getLiveAnalytics(uuid).subscribe({
      next: response => {
        if (response.status === 'success') {
          const data = response.data;
          this.eventTitle.set(data.event.title);
          this.kpis.set(data.kpis);
          this.attendees.set(data.attendees || []);
        } else {
          this.errorMsg.set('Não foi possível carregar as estatísticas.');
        }
        this.isLoading.set(false);
      },
      error: err => {
        console.error("Error fetching live analytics:", err);
        this.errorMsg.set(err.error?.message || 'Falha ao carregar o relatório pós-live.');
        this.isLoading.set(false);
      }
    });
  }
}
