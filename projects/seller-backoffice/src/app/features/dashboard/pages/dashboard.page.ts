import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardApiService } from '../dashboard.api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  template: `
    <div class="p-6 max-w-full mx-auto space-y-8">
      
      <!-- HEADER -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-black text-gray-900 uppercase tracking-tighter">Painel do Organizador</h1>
          <p class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Resumo das suas vendas e estatísticas de streaming</p>
        </div>
      </div>

      @if(isLoading()){
        <div class="flex items-center justify-center py-20">
          <svg class="animate-spin h-8 w-8 text-(--primary)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      } @else {
        
        <!-- WIDGETS CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Receita Prevista -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Receita Prevista</span>
              <h3 class="text-xl font-black text-gray-900 mt-1">AOA {{ getWidgetCount(revenueWidgets, 'Total previsto') }}</h3>
            </div>
            <div class="bg-blue-50 text-blue-600 p-3 rounded-2xl text-xl">
              💰
            </div>
          </div>

          <!-- Receita Concluída -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Receita Confirmada</span>
              <h3 class="text-xl font-black text-green-600 mt-1">AOA {{ getWidgetCount(revenueWidgets, 'Total das compras concluídas') }}</h3>
            </div>
            <div class="bg-green-50 text-green-600 p-3 rounded-2xl text-xl">
              💵
            </div>
          </div>

          <!-- Ingressos Vendidos -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ingressos Vendidos</span>
              <h3 class="text-xl font-black text-gray-900 mt-1">{{ getWidgetCount(salesWidgets, 'Total de vendas') }}</h3>
            </div>
            <div class="bg-red-50 text-(--primary) p-3 rounded-2xl text-xl">
              🎟️
            </div>
          </div>

          <!-- Total Eventos -->
          <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total de Eventos</span>
              <h3 class="text-xl font-black text-gray-900 mt-1">{{ getWidgetCount(eventsWidgets, 'Total de eventos') }}</h3>
            </div>
            <div class="bg-purple-50 text-purple-600 p-3 rounded-2xl text-xl">
              📅
            </div>
          </div>

        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          
          <!-- EVENTOS MAIS VISTOS -->
          <div class="col-span-1 lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              📊 Eventos Mais Vistos
            </h3>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="border-b border-gray-100 text-gray-400 uppercase font-black tracking-wider">
                    <th class="pb-3">Evento</th>
                    <th class="pb-3">Data</th>
                    <th class="pb-3 text-center">Visualizações</th>
                    <th class="pb-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  @for (ev of mostViewedEvents(); track ev.slug) {
                    <tr class="text-gray-700 font-medium">
                      <td class="py-3.5 font-bold text-gray-900">{{ ev.title }}</td>
                      <td class="py-3.5 text-gray-500">{{ ev.date }} às {{ ev.time }}</td>
                      <td class="py-3.5 text-center font-bold text-gray-900">{{ ev.views_count | number }}</td>
                      <td class="py-3.5 text-center">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase"
                          [class.bg-green-50]="ev.status === 'Activo'"
                          [class.text-green-600]="ev.status === 'Activo'"
                          [class.bg-yellow-50]="ev.status === 'Em espera'"
                          [class.text-yellow-600]="ev.status === 'Em espera'"
                          [class.bg-gray-100]="ev.status === 'Inactivo'"
                          [class.text-gray-500]="ev.status === 'Inactivo'">
                          {{ ev.status }}
                        </span>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="py-6 text-center text-gray-400">Nenhum evento registrado</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- RESUMO POR ESTADO -->
          <div class="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-sm font-black text-gray-900 uppercase tracking-wider mb-6">
                📌 Resumo de Eventos
              </h3>
              
              <div class="space-y-4">
                @for (widget of eventsWidgets; track $index) {
                  @if(widget.title !== 'Total de eventos'){
                    <div class="flex justify-between items-center p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <span class="text-xs font-bold text-gray-600 uppercase tracking-tight">{{ widget.title }}</span>
                      <span class="text-sm font-black text-gray-900 px-3 py-1 rounded-full bg-white border border-gray-100 shadow-sm">{{ widget.count }}</span>
                    </div>
                  }
                }
              </div>
            </div>
            
            <div class="pt-6 border-t border-gray-50 mt-6 text-center">
              <a routerLink="/my-account/events" class="text-xs font-black text-(--primary) uppercase tracking-wider hover:underline">
                Gerir todos os eventos &rarr;
              </a>
            </div>
          </div>

        </div>

      }

    </div>
  `,
  styles: ``
})
export class DashboardPage implements OnInit {
  private api = inject(DashboardApiService);

  isLoading = signal<boolean>(true);
  eventsWidgets: any[] = [];
  revenueWidgets: any[] = [];
  salesWidgets: any[] = [];
  mostViewedEvents = signal<any[]>([]);

  ngOnInit(): void {
    this.api.getDashboardStats().subscribe({
      next: response => {
        if (response.status === 200) {
          const data = response.data;
          this.eventsWidgets = data.events_status_widgets || [];
          this.revenueWidgets = data.revenue_widgets || [];
          this.salesWidgets = data.sales_widgets || [];
          this.mostViewedEvents.set(data.most_viewed_events || []);
        }
        this.isLoading.set(false);
      },
      error: error => {
        console.error("Failed to load dashboard metrics:", error);
        this.isLoading.set(false);
      }
    });
  }

  getWidgetCount(widgets: any[], title: string): string {
    const item = widgets.find(w => w.title === title);
    return item ? item.count : '0';
  }
}
