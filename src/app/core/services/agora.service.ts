import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID, Signal, signal } from "@angular/core";
import { StreamStats } from "@core/api/stream-stats.service";
import AgoraRTC, { IAgoraRTCClient, IRemoteAudioTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import { take } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AgoraIOService{
    private agoraRtcClient!: IAgoraRTCClient;
    remoteVideoTrack?: IRemoteVideoTrack;
    remoteAudioTrack?: IRemoteAudioTrack;
    private platformId = inject(PLATFORM_ID);

    isLive = signal<boolean>(false);
    isMuted = signal<boolean>(false);
    isFullScreen = signal<boolean>(false);
    volume = signal<number>(100);
    isRemoteVideoMuted = signal<boolean>(false);
    isRemoteAudioMuted = signal<boolean>(false);
    activeUsers = signal<number>(0);
    
    private AppId: string = environment.agoraAppId;
    private ChannelName: string = '';
    private Token: string = '';
    private AgoraUId: number = 0;

    public set channelName(channel: string){
        this.ChannelName = channel;
    }

    public set token(token: string){
        this.Token = token;
    }

    public set agoraUId(id: number){
        this.AgoraUId = id;
    }
    
    public get channelName(): string{
        return this.ChannelName;
    }
    
    public get token(): string{
        return this.Token;
    }
    
    public get agoraUId(): number{
        return this.AgoraUId;
    }

    async joinAsAudience(): Promise<void>{
        if(!isPlatformBrowser(this.platformId)) return;
        this.agoraRtcClient = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
        await this.agoraRtcClient.setClientRole('audience');
        
        this.agoraRtcClient.on('user-published', async (user, mediaType) => {
            await this.agoraRtcClient.subscribe(user, mediaType);

            if(mediaType === 'video'){
                this.remoteVideoTrack = user[`${mediaType}Track`];
                this.isRemoteVideoMuted.set(false);
                // on live player page
                const container = document.getElementById('remote-player');
                if(container && this.remoteVideoTrack){
                    container.innerHTML = '';
                    container.style.width = '100%';
                    container.style.height = '100%';
                    container.style.backgroundColor = '#000';
                    setTimeout(() => this.remoteVideoTrack?.play(container), 0);
                }
            }

            if(mediaType === 'audio'){
                this.remoteAudioTrack = user.audioTrack;
                this.isRemoteAudioMuted.set(false);
                this.remoteAudioTrack?.play();
            }

            this.isLive.set(true);
        });

        this.agoraRtcClient.on('user-unpublished', (user, mediaType) => {
            if(mediaType === 'video'){
                this.isRemoteVideoMuted.set(true);
            }
            if(mediaType === 'audio'){
                this.isRemoteAudioMuted.set(true);
            }
        });

        await this.agoraRtcClient.join(this.AppId, this.channelName, this.token, this.agoraUId);

    }

    get rtcClient(): Signal<IAgoraRTCClient>{
        return signal<IAgoraRTCClient>(this.agoraRtcClient);
    }

    async leave(): Promise<void>{
        await this.agoraRtcClient.leave();
    }

    // Ações do Painel Profissional
    toggleFullscreen() {
        const elem = document.getElementById('player-wrapper');
        if (!document.fullscreenElement) {
        elem?.requestFullscreen();
        this.isFullScreen.set(true);
        } else {
        document.exitFullscreen();
        this.isFullScreen.set(false);
        }
    }

    toggleMute() {
        if (this.remoteAudioTrack) {
        if (this.isMuted()) {
            this.remoteAudioTrack.setVolume(100);
        } else {
            this.remoteAudioTrack.setVolume(0);
        }
        this.isMuted.set(!this.isMuted());
        }
    }

}