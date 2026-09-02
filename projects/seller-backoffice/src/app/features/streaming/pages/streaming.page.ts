import { DecimalPipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, computed, inject, OnDestroy, OnInit, signal, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AgoraIOService } from '@seller-backoffice-core/services/agora.service';
import { StreamStats } from '@seller-backoffice-core/services/stream-stats.service';
import { StreamService } from '@seller-backoffice-core/services/stream.service';
import { take } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-streaming',
  imports: [ DecimalPipe, FormsModule ],
  template: `
    @if(!notFound()){
      
      <div class="max-w-full mx-auto p-4 lg:p-6 h-[calc(100vh-100px)] lg:h-[calc(140vh-100px)]">
        <div class="grid grid-cols-12 gap-6 h-full">
          
          <!-- LADO ESQUERDO: MONITOR DE VÍDEO (8 Colunas) -->
          <div class="col-span-12 lg:col-span-8 flex flex-col gap-4">
            
            <!-- HEADER DO STUDIO -->
            <div class="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div class="flex items-center gap-4">
                <div class="bg-(--primary)/10 p-2 rounded-lg">
                  <span class="text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-video"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20.117 7.625a1 1 0 0 0 -.564 .1l-4.553 2.275v4l4.553 2.275a1 1 0 0 0 1.447 -.892v-6.766a1 1 0 0 0 -.883 -.992z" /><path d="M5 5c-1.645 0 -3 1.355 -3 3v8c0 1.645 1.355 3 3 3h8c1.645 0 3 -1.355 3 -3v-8c0 -1.645 -1.355 -3 -3 -3z" /></svg>
                  </span>
                </div>
                <div>
                  <h2 class="text-sm font-black text-gray-900 uppercase tracking-tighter">Live: {{ eventInLive()[0].title }}</h2>
                  <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{{ eventInLive()[0].location.name }}</p>
                </div>
              </div>

              <!-- Rede & Indicadores de QoS -->
              <div class="flex items-center gap-6">
                @if(isPublishing()){
                  <div class="flex items-center gap-2" [title]="'Qualidade da ligação: ' + getNetworkLabel(networkQuality())">
                    <span class="text-[10px] font-bold text-gray-400 uppercase">Sinal</span>
                    <div class="flex items-end gap-[2px] h-4">
                      <div class="w-[3px] h-2 rounded-full" [class.bg-green-500]="networkQuality() <= 2 && networkQuality() > 0" [class.bg-yellow-500]="networkQuality() === 3" [class.bg-red-500]="networkQuality() >= 4 || networkQuality() === 0"></div>
                      <div class="w-[3px] h-3 rounded-full" [class.bg-green-500]="networkQuality() <= 2 && networkQuality() > 0" [class.bg-yellow-500]="networkQuality() === 3" [class.bg-gray-200]="networkQuality() >= 4 || networkQuality() === 0"></div>
                      <div class="w-[3px] h-4 rounded-full" [class.bg-green-500]="networkQuality() <= 2 && networkQuality() > 0" [class.bg-gray-200]="networkQuality() >= 3 || networkQuality() === 0"></div>
                    </div>
                  </div>
                }

                <div class="h-8 w-[1px] bg-gray-100"></div>

                <div class="flex flex-col items-end">
                  <span class="text-[10px] font-bold text-gray-400 uppercase">Duração</span>
                  <span class="text-sm font-mono font-bold" [class.text-(--primary)]="isPublishing()">{{ duration() }}</span>
                </div>
                <div class="h-8 w-[1px] bg-gray-100"></div>
                <div class="flex flex-col items-end">
                  <span class="text-[10px] font-bold text-gray-400 uppercase">Espectadores</span>
                  <span class="text-sm font-bold">{{ activeUsers() | number }}</span>
                </div>
              </div>
            </div>

            <!-- PLAYER DE PREVIEW -->
            <div class="relative flex-1 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl min-h-[300px]">
              
              <div id="local-player" class="w-full h-full object-cover"></div>

               @if(!isCamOn() && !isScreenSharing()){
                 <div class="absolute inset-0 bg-black flex flex-col items-center justify-center z-10">
                   <span class="text-4xl mb-4 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-camera-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8.297 4.289a.997 .997 0 0 1 .703 -.289h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v8m-1.187 2.828c-.249 .11 -.524 .172 -.813 .172h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h1c.298 0 .58 -.065 .834 -.181" /><path d="M10.422 10.448a3 3 0 1 0 4.15 4.098" /><path d="M3 3l18 18" /></svg>
                   </span>
                   <p class="text-white font-bold">Sua câmera está desligada</p>
                 </div>
               }

              <!-- OVERLAY DE STATUS & QoS STATS -->
              <div class="absolute top-6 left-6 flex flex-col gap-2">
                <div class="flex gap-3">
                  @if(isPublishing()){
                    <span class="bg-(--primary) text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl animate-pulse">
                      ON AIR / AO VIVO
                    </span>
                  } @else {
                    <span class="bg-gray-700 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">
                      PREVIEW MODE
                    </span>
                  }

                  @if(isScreenSharing()){
                    <span class="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">
                      ECRÃ PARTILHADO
                    </span>
                  }
                </div>

                @if(isPublishing() && videoBitrate() > 0){
                  <div class="bg-black/60 backdrop-blur-md text-[9px] text-gray-300 px-3 py-2 rounded-xl flex flex-col gap-0.5 max-w-max font-mono leading-none">
                    <span>Res: {{ videoResolution() }}</span>
                    <span>FPS: {{ videoFps() }} fps</span>
                    <span>Bitrate: {{ videoBitrate() }} kbps</span>
                  </div>
                }
              </div>
            </div>

            <!-- BARRA DE FERRAMENTAS DO HOST (CONTROLES) -->
            <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex flex-wrap gap-4 items-center justify-between">
              <div class="flex items-center gap-3">
                <button (click)="toggleMic()" 
                  [class.bg-gray-100]="isMicOn()" [class.bg-red-100]="!isMicOn()"
                  class="w-12 h-12 cursor-pointer rounded-2xl flex items-center justify-center transition-all hover:scale-105"
                  title="Ativar/Desativar Microfone">
                  <span class="text-xl">
                    @if(isMicOn()){
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-microphone"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" /><path d="M5 10a7 7 0 0 0 14 0" /><path d="M8 21l8 0" /><path d="M12 17l0 4" /></svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-microphone-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 3l18 18" /><path d="M9 5a3 3 0 0 1 6 0v5a3 3 0 0 1 -.13 .874m-2 2a3 3 0 0 1 -3.87 -2.872v-1" /><path d="M5 10a7 7 0 0 0 10.846 5.85m2 -2a6.967 6.967 0 0 0 1.152 -3.85" /><path d="M8 21l8 0" /><path d="M12 17l0 4" /></svg>
                    }
                  </span>
                </button>
                
                <button (click)="toggleCam()" 
                  [disabled]="isScreenSharing()"
                  [class.bg-gray-100]="isCamOn()" [class.bg-red-100]="!isCamOn()"
                  class="w-12 h-12 cursor-pointer rounded-2xl flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50"
                  title="Ativar/Desativar Câmara">
                  <span class="text-xl">
                    @if(isCamOn()){
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-video"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" /><path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" /></svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-video-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 3l18 18" /><path d="M15 11v-1l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -.675 .946" /><path d="M10 6h3a2 2 0 0 1 2 2v3m0 4v1a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2h-8a2 2 0 0 1 -2 -2z" /></svg>
                    }
                  </span>
                </button>

                <button (click)="toggleScreenShare()" 
                  [class.bg-gray-100]="!isScreenSharing()" [class.bg-blue-100]="isScreenSharing()"
                  class="w-12 h-12 cursor-pointer rounded-2xl flex items-center justify-center transition-all hover:scale-105"
                  title="Partilhar Ecrã">
                  <span class="text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-screen-share"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h7" /><path d="M7 20l10 0" /><path d="M9 16l0 4" /><path d="M15 16l0 4" /><path d="M17 4h4v4" /><path d="M16 9l5 -5" /></svg>
                  </span>
                </button>
              </div>

              <div class="flex items-center gap-3 flex-wrap">
                @if(cameras().length > 0 && !isScreenSharing()){
                  <select (change)="onCameraChange($event)" [value]="selectedCameraId()" class="text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 max-w-[150px] font-bold text-gray-700 outline-none">
                    @for (cam of cameras(); track cam.deviceId) {
                      <option [value]="cam.deviceId">{{ cam.label || 'Câmara ' + ($index + 1) }}</option>
                    }
                  </select>
                }

                @if(microphones().length > 0){
                  <select (change)="onMicrophoneChange($event)" [value]="selectedMicrophoneId()" class="text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 max-w-[150px] font-bold text-gray-700 outline-none">
                    @for (mic of microphones(); track mic.deviceId) {
                      <option [value]="mic.deviceId">{{ mic.label || 'Microfone ' + ($index + 1) }}</option>
                    }
                  </select>
                }
              </div>

              <div class="flex items-center gap-4">
                @if(!isPublishing()){
                  <button (click)="startBroadcast()"
                    class="bg-(--primary) cursor-pointer hover:opacity-90 text-white font-black px-10 py-4 rounded-2xl shadow-lg shadow-(--primary)/30 transition-all flex items-center gap-3 uppercase text-sm tracking-widest">
                    <span class="w-3 h-3 bg-white rounded-full"></span>
                    Transmitir Agora
                  </button>
                } @else {
                  <button (click)="stopBroadcast()"
                    class="bg-gray-900 cursor-pointer hover:bg-black text-white font-black px-10 py-4 rounded-2xl shadow-xl transition-all flex items-center gap-3 uppercase text-sm tracking-widest">
                    <span class="w-3 h-3 bg-(--primary) rounded-full animate-ping"></span>
                    Encerrar Live
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- LADO DIREITO: CHAT DA LIVE (4 Colunas) -->
          <div class="col-span-12 lg:col-span-4 flex flex-col bg-white border border-gray-100 rounded-3xl p-4 shadow-xl h-full max-h-[calc(100vh-100px)]">
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 class="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <span class="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                Chat ao Vivo (Agora)
              </h3>
              <span class="text-[10px] font-bold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full uppercase">
                Data Stream
              </span>
            </div>

            <div id="chat-messages-container" class="flex-1 overflow-y-auto my-4 space-y-3 pr-1 text-xs">
              @for (msg of chatMessages(); track $index) {
                <div class="flex flex-col gap-0.5 max-w-[85%] rounded-2xl p-3 animate-fade-in"
                  [class.bg-red-50]="msg.isHost"
                  [class.border]="msg.isHost"
                  [class.border-red-100]="msg.isHost"
                  [class.bg-gray-50]="!msg.isHost"
                  [class.self-end]="msg.isHost"
                  [class.ml-auto]="msg.isHost">
                  
                  <div class="flex items-center justify-between gap-4 mb-1">
                    <span class="font-bold uppercase tracking-tight" [class.text-red-600]="msg.isHost" [class.text-gray-700]="!msg.isHost">
                      {{ msg.sender }}
                      @if(msg.isHost){
                        <span class="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded ml-1 font-black">HOST</span>
                      }
                    </span>
                    <span class="text-[9px] text-gray-400">{{ msg.time }}</span>
                  </div>
                  
                  <p class="text-gray-800 break-words whitespace-pre-wrap leading-relaxed">{{ msg.text }}</p>
                </div>
              } @empty {
                <div class="h-full flex flex-col items-center justify-center text-center text-gray-400 p-6 gap-2">
                  <span class="text-3xl">💬</span>
                  <p class="font-bold">O chat está vazio</p>
                  <p class="text-[10px] leading-snug">Envie uma mensagem para iniciar a conversa no canal!</p>
                </div>
              }
            </div>

            <div class="pt-3 border-t border-gray-100">
              <form (submit)="sendChatMessage($event)" class="flex gap-2">
                <input type="text" [(ngModel)]="newChatMessage" name="chatMessage" placeholder="Escreva uma mensagem..."
                  class="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-red-500 focus:bg-white transition-all font-medium"
                  required autocomplete="off">
                <button type="submit" class="bg-red-500 hover:bg-red-600 cursor-pointer text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-brand-telegram"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" /></svg>
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    } @else {
      <p class="text-base text-black/70 text-center">
        You were not supposed to be here. Select an event to start the live.
      </p>
    }
  `,
  styles: ``
})
export class StreamingPage implements OnInit, OnDestroy {
  private streamService = inject(StreamService);
  private agoraService = inject(AgoraIOService);
  private router = inject(Router);
  
  eventInLive = computed(() => this.streamService.eventInLive());
  notFound = signal<boolean>(true);
  isClosing = signal<boolean>(false);

  isMicOn = computed(() => this.agoraService.isMicOn());
  isCamOn = computed(() => this.agoraService.isCamOn());
  isPublishing = computed(() => this.agoraService.isPublishing());
  duration = computed(() => this.agoraService.duration());
  activeUsers = computed(() => this.agoraService.activeUsers());

  // QoS values from AgoraService
  networkQuality = computed(() => this.agoraService.networkQuality());
  videoBitrate = computed(() => this.agoraService.videoBitrate());
  videoFps = computed(() => this.agoraService.videoFps());
  videoResolution = computed(() => this.agoraService.videoResolution());

  // Device selectors values
  cameras = computed(() => this.agoraService.cameras());
  microphones = computed(() => this.agoraService.microphones());
  selectedCameraId = computed(() => this.agoraService.selectedCameraId());
  selectedMicrophoneId = computed(() => this.agoraService.selectedMicrophoneId());

  // Screen share status
  isScreenSharing = computed(() => this.agoraService.isScreenSharing());

  // Chat messages
  chatMessages = computed(() => this.agoraService.chatMessages());
  newChatMessage: string = '';

  streamStats = inject(StreamStats);
  interval: any;

  ngOnInit(): void {
    if(!(this.streamService.eventInLive().length > 0)){
      this.notFound.set(true);
      return;
    }

    this.notFound.set(false);
    this.agoraService.startBroadcast();
    this.startUsersCounter(10);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  toggleCam(): void{
    this.agoraService.toggleCam();
  }

  toggleMic(): void{
    this.agoraService.toggleMic();
  }

  toggleScreenShare(): void {
    this.agoraService.toggleScreenShare();
  }

  onCameraChange(event: Event): void {
    const deviceId = (event.target as HTMLSelectElement).value;
    this.agoraService.switchCamera(deviceId);
  }

  onMicrophoneChange(event: Event): void {
    const deviceId = (event.target as HTMLSelectElement).value;
    this.agoraService.switchMicrophone(deviceId);
  }

  sendChatMessage(event: Event): void {
    event.preventDefault();
    if (!this.newChatMessage.trim()) return;

    this.agoraService.sendChatMessage('Organizador', this.newChatMessage.trim());
    this.newChatMessage = '';

    setTimeout(() => {
      const container = document.getElementById('chat-messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  getNetworkLabel(quality: number): string {
    switch (quality) {
      case 1: return 'Excelente';
      case 2: return 'Bom';
      case 3: return 'Instável';
      case 4: return 'Fraco';
      case 5: return 'Muito Fraco';
      case 6: return 'Sem Ligação';
      default: return 'Desconhecido';
    }
  }

  startUsersCounter(intervalInSeconds: number): void{
    this.interval = setInterval(() => {
      this.streamStats.countUsers(this.streamService.eventInLive()[0].slug).pipe(take(1)).subscribe(response => this.agoraService.activeUsers.set(response.count))
    }, intervalInSeconds * 1000);
  }

  startBroadcast(): void{
    this.agoraService.startBroadcast();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event: BeforeUnloadEvent) {
    if (this.isPublishing()) {
      event.preventDefault();
      event.returnValue = true;
      return 'A sua transmissão ao vivo será interrompida.';
    }
    return undefined;
  }

  canDeactivate(): boolean {
    if (this.isPublishing()) {
      return confirm('Tem a certeza de que deseja sair desta página? A sua transmissão ao vivo será interrompida.');
    }
    return true;
  }

  stopBroadcast(): void{
    const confirmClose = confirm('Deseja realmente encerrar a transmissão ao vivo? Esta ação não pode ser desfeita e consolidará os dados estatísticos da live.');
    if (!confirmClose) {
      return;
    }
    this.isClosing.set(true);
    this.streamService.end().pipe(take(1)).subscribe({
      next: response => {
        if(response.status === HttpStatusCode.Ok){
          this.agoraService.stopBroadcast();
        }
        this.router.navigate(['/my-account/events'])
        this.isClosing.set(false);
      },
      error: error => {
        this.isClosing.set(false);
      }
    })
  }

}
