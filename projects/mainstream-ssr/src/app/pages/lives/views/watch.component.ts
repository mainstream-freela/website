import { DecimalPipe, isPlatformBrowser, NgClass } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StreamStats } from '@core/api/stream-stats.service';
import { AgoraIOService } from '@core/services/agora.service';
import { StreamService } from '@core/services/stream.service';
import { firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-watch',
  imports: [NgClass, DecimalPipe],
  template: `
  <div class="limited-container relative py-10">
     @if (!notFound()) {
      <div class="max-w-7xl mx-auto p-4 lg:p-8 h-full">
        <div class="flex flex-col lg:flex-row gap-8 h-full">
          
          <!-- ÁREA DO VÍDEO -->
          <div class="flex-1">
            <!-- Player Wrapper com ID para Fullscreen -->
            <div id="player-wrapper" class="relative group bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video border border-white/10">
              
              <!-- Container do Vídeo Agora.io -->
              <div id="remote-player" class="w-full h-full pointer-events-none"></div>

              <!-- Overlay de Carregamento -->
              @if(isLive() && isRemoteVideoMuted()){
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/95 z-20 backdrop-blur-sm transition-all">
                  <span class="text-4xl mb-4 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-camera-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8.297 4.289a.997 .997 0 0 1 .703 -.289h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v8m-1.187 2.828c-.249 .11 -.524 .172 -.813 .172h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1c.298 0 .58 -.065 .834 -.181" /><path d="M10.422 10.448a3 3 0 1 0 4.15 4.098" /><path d="M3 3l18 18" /></svg>
                   </span>
                  <h3 class="text-white font-black text-lg">Câmera desativada</h3>
                  <p class="text-white/60 text-xs">O organizador pausou a imagem momentaneamente.</p>
                </div>
              }

              @else if(!isLive()){
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-10">
                  <div class="relative">
                    <div class="w-20 h-20 border-2 border-(--primary)/20 rounded-full"></div>
                    <div class="absolute inset-0 w-20 h-20 border-t-2 border-(--primary) rounded-full animate-spin"></div>
                  </div>
                  <p class="text-white mt-6 font-medium tracking-widest text-sm opacity-50 uppercase">Aguardando Sinal...</p>
                </div>
              }

              <!-- Barra Superior (Status) -->
              <div class="absolute top-0 left-0 right-0 p-6 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div class="flex gap-2">
                  <span class="bg-(--primary) text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    AO VIVO
                  </span>
                </div>
                
                <button (click)="exitLive()" class="bg-white/10 cursor-pointer hover:bg-(--primary) backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center gap-2">
                  <span>✕</span> Sair da Live
                </button>
              </div>

              <!-- Barra de Controles Inferior (ESTILO CINEMA) -->
              <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div class="flex items-center justify-between">
                  
                  <!-- Esquerda: Play e Volume -->
                  <div class="flex items-center gap-6">
                    <button (click)="toggleMute()" class="text-white cursor-pointer hover:text-(--primary) transition-colors">
                      @if(isMuted()){
                        <span class="text-xl text-(--primary)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-volume-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 1.912 4.934m-1.377 2.602a5 5 0 0 1 -.535 .464" /><path d="M17.7 5a9 9 0 0 1 2.362 11.086m-1.676 2.299a9 9 0 0 1 -.686 .615" /><path d="M9.069 5.054l.431 -.554a.8 .8 0 0 1 1.5 .5v2m0 4v8a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l1.294 -1.664" /><path d="M3 3l18 18" /></svg>
                        </span>
                      } @else {
                        <span class="text-xl">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-volume"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /></svg>
                        </span>
                      }
                    </button>
                    
                    <div class="flex flex-col">
                      <span class="text-white text-sm font-bold truncate max-w-[200px] md:max-w-sm">{{ eventInLive()[0].title }}</span>
                      <span class="text-white/60 text-[10px] uppercase tracking-tighter">Transmitido por {{ eventInLive()[0].advertiser.name }}</span>
                    </div>
                    
                    <div class="text-white text-sm">
                      @if (isRemoteAudioMuted()) {
                        <span class="text-(--primary) flex gap-2 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-microphone-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 3l18 18" /><path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1" /><path d="M5 10a7 7 0 0 0 10.846 5.85m2 -2a6.967 6.967 0 0 0 1.152 -3.85" /><path d="M8 21l8 0" /><path d="M12 17l0 4" /></svg>
                          Áudio do Anfitrião: Silenciado
                        </span>
                      } @else {
                        <span class="flex gap-2 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-microphone"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" /><path d="M5 10a7 7 0 0 0 14 0" /><path d="M8 21l8 0" /><path d="M12 17l0 4" /></svg>
                          Áudio do Anfitrião: Ativo
                        </span>
                      }
                    </div>
                  </div>

                  <!-- Direita: Configs e Fullscreen -->
                  <div class="flex items-center gap-5">                    
                    <button (click)="toggleFullScreen()" [ngClass]="{
                      'bg-(--primary)/70!': this.isFullScreen()
                    }" class="bg-white/10 cursor-pointer hover:bg-white/20 p-2 rounded-lg transition-all border border-white/10">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Info Adicional abaixo do Vídeo -->
            <div class="mt-8 flex justify-between items-start">
              <div class="flex gap-4">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-(--primary) to-red-700 flex items-center justify-center text-white text-xl font-black shadow-xl shadow-(--primary)/20">
                  {{ eventInLive()[0].advertiser.name.charAt(0) }}
                </div>
                <div>
                  <h2 class="text-xl font-black text-gray-900 tracking-tight">{{ eventInLive()[0].title }}</h2>
                  <p class="text-gray-500 text-sm flex items-center gap-2">
                    {{ eventInLive()[0].category.name }} • <span class="text-(--primary) font-bold">{{ this.usersCount() | number }} pessoas assistindo agora</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
     } @else {
      <div class="not-found h-32 pt-12">
        <p class="text-black/70 text-base font-medium text-center">Faça a compra do ingresso de um evento com transmissão ao vivo.</p>
      </div>
     }
  </div>
  `,
  styles: ``
})
export class WatchComponent implements OnInit, OnDestroy {
  private streamService = inject(StreamService);
  private agoraService = inject(AgoraIOService);
  private router = inject(Router);
  private streamStats = inject(StreamStats);

  private platformId = inject(PLATFORM_ID);

  notFound = signal<boolean>(true);
  event = computed(() => this.streamService.eventInLive())
  isLive = computed(() => this.agoraService.isLive());
  isMuted = computed(() => this.agoraService.isMuted());
  isFullScreen = computed(() => this.agoraService.isFullScreen());
  eventInLive = computed(() => this.streamService.eventInLive());

  usersCount = computed(() => this.agoraService.activeUsers())
  
  isRemoteVideoMuted = computed(() => this.agoraService.isRemoteVideoMuted());
  isRemoteAudioMuted = computed(() => this.agoraService.isRemoteAudioMuted());

  interval: any;

  ngOnInit(): void {
    if(!(this.streamService.eventInLive().length > 0)){
      this.notFound.set(true);
      return;
    }

    this.notFound.set(false);

    if(isPlatformBrowser(this.platformId)){
      this.agoraService.joinAsAudience();
      this.startPingInterval(10);
    }

  }

  toggleFullScreen() {
    this.agoraService.toggleFullscreen();
  }

  toggleMute() {
    this.agoraService.toggleMute();
  }

  startPingInterval(intervalInSeconds: number): void{
    this.interval = setInterval(() => {
      this.streamService.ping({ agora_uid: this.agoraService.agoraUId }).pipe(take(1)).subscribe();
      this.streamStats.countUsers(this.agoraService.agoraUId).pipe(take(1)).subscribe(response => this.agoraService.activeUsers.set(response.count))
    }, intervalInSeconds * 1000);
  }
  
  async exitLive() {
    if (this.agoraService.rtcClient()) {
      await firstValueFrom(this.streamService.leave({ agora_uid: this.agoraService.agoraUId }).pipe(take(1)));
      await this.agoraService.leave();
    }
    this.router.navigate(['/lives/access']);
  }

  ngOnDestroy() {
    if(this.interval){
      clearInterval(this.interval);
    }

    if(this.agoraService.rtcClient()){
      this.agoraService?.leave();
    }
  }
}
