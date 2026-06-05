import { inject, Injectable, signal } from "@angular/core";
import { environment } from "@seller-backoffice-environments/environment";
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

@Injectable({
    providedIn: 'root'
})
export class AgoraIOService{
    private agoraRtcClient!: IAgoraRTCClient;
    private AppId: string = environment.agoraAppId;
    private ChannelName: string = '';
    private Token: string = '';
    private AgoraUId: number = 0;
    
    localVideoTrack?: ICameraVideoTrack;
    localAudioTrack?: IMicrophoneAudioTrack;

    isPublishing = signal<boolean>(false);
    isMicOn = signal<boolean>(true);
    isCamOn = signal<boolean>(true);
    duration= signal<string>('00:00:00');
    timerInterval: any;
    activeUsers = signal<number>(0);

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

    async startBroadcast(): Promise<void>{

        AgoraRTC.setLogLevel(4);

        this.agoraRtcClient = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
        await this.agoraRtcClient.setClientRole('host');

        await this.agoraRtcClient.join(this.AppId, this.channelName, this.token, this.agoraUId);

        const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        this.localAudioTrack = micTrack;
        this.localVideoTrack = camTrack;

        const container = document.getElementById('local-player');
        if(container && this.localVideoTrack){
            container.innerHTML = '';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.backgroundColor = '#000';
            setTimeout(() => this.localVideoTrack?.play(container), 0);
        }

        await this.agoraRtcClient.publish([ this.localAudioTrack, this.localVideoTrack ]);

        this.isPublishing.set(true);
        this.startTimer();

    }

    toggleMic() {
        this.isMicOn.set(!this.isMicOn());
        this.localAudioTrack?.setEnabled(this.isMicOn());
    }

    toggleCam() {
        this.isCamOn.set(!this.isCamOn());
        this.localVideoTrack?.setEnabled(this.isCamOn());
    }

    startTimer() {
        let seconds = 0;
        this.timerInterval = setInterval(() => {
            seconds++;
            this.duration.update(val  => val = new Date(seconds * 1000).toISOString().substr(11, 8));
        }, 1000);
    }

    async stopBroadcast() {
        // Parar faixas locais
        this.localVideoTrack?.close();
        this.localAudioTrack?.close();
        
        // Despublicar e sair
        await this.agoraRtcClient.unpublish();
        await this.agoraRtcClient.leave();
        
        this.isPublishing.set(false);
        clearInterval(this.timerInterval);
    }

}