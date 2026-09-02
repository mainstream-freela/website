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
    statsInterval: any;
    activeUsers = signal<number>(0);

    // QoS Stats Signals
    networkQuality = signal<number>(0);
    videoBitrate = signal<number>(0);
    videoFps = signal<number>(0);
    videoResolution = signal<string>('N/A');

    // Devices Signals
    cameras = signal<MediaDeviceInfo[]>([]);
    microphones = signal<MediaDeviceInfo[]>([]);
    selectedCameraId = signal<string>('');
    selectedMicrophoneId = signal<string>('');

    // Screen Share Signals
    isScreenSharing = signal<boolean>(false);
    localScreenTrack?: any;

    // Chat Signals (Agora RTC Data Streams)
    chatMessages = signal<Array<{ sender: string, text: string, time: string, isHost: boolean }>>([]);
    private dataStreamId?: number;

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

        // 1. Setup QoS Quality Listeners
        this.setupQoSMonitoring();

        // 2. Setup Data Streams for Chat
        this.setupChatDataStream();

        // 3. Load Available Hardware Devices
        await this.loadDevices();
    }

    private setupQoSMonitoring(): void {
        this.agoraRtcClient.on("network-quality", (quality) => {
            this.networkQuality.set(quality.uplinkNetworkQuality);
        });

        this.statsInterval = setInterval(() => {
            if (!this.isPublishing()) return;
            try {
                if (this.localVideoTrack && !this.isScreenSharing()) {
                    const stats = this.localVideoTrack.getStats() as any;
                    if (stats) {
                        this.videoBitrate.set(Math.round((stats.sendBitrate || 0) / 1000));
                        this.videoFps.set(stats.sendFrameRate || 0);
                        this.videoResolution.set(`${stats.captureWidth || 0}x${stats.captureHeight || 0}`);
                    }
                } else if (this.localScreenTrack && this.isScreenSharing()) {
                    const stats = this.localScreenTrack.getStats() as any;
                    if (stats) {
                        this.videoBitrate.set(Math.round((stats.sendBitrate || 0) / 1000));
                        this.videoFps.set(stats.sendFrameRate || 0);
                        this.videoResolution.set(`${stats.captureWidth || 0}x${stats.captureHeight || 0}`);
                    }
                }
            } catch (err) {
                console.error("Error reading track stats:", err);
            }
        }, 2000);
    }

    private setupChatDataStream(): void {
        try {
            this.dataStreamId = (this.agoraRtcClient as any).createDataStream({ ordered: true, reliable: true });
        } catch (err) {
            console.error("Failed to create RTC data stream:", err);
        }

        this.agoraRtcClient.on("stream-message", (uid, data) => {
            try {
                const decoded = new TextDecoder().decode(data);
                const payload = JSON.parse(decoded);
                payload.isHost = payload.sender === 'Organizador';
                this.chatMessages.update(msgs => [...msgs, payload]);
            } catch (err) {
                console.error("Failed to parse incoming stream message:", err);
            }
        });
    }

    sendChatMessage(senderName: string, text: string): void {
        const payload = {
            sender: senderName,
            text: text,
            time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
            isHost: true
        };

        this.chatMessages.update(msgs => [...msgs, payload]);

        if (this.agoraRtcClient && this.dataStreamId !== undefined) {
            try {
                const encoded = new TextEncoder().encode(JSON.stringify(payload));
                (this.agoraRtcClient as any).sendStreamMessage(this.dataStreamId, encoded);
            } catch (err) {
                console.error("Failed to broadcast chat message:", err);
            }
        }
    }

    async loadDevices(): Promise<void> {
        try {
            const devices = await AgoraRTC.getDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            const audioDevices = devices.filter(d => d.kind === 'audioinput');
            this.cameras.set(videoDevices);
            this.microphones.set(audioDevices);

            if (this.localVideoTrack) {
                const label = this.localVideoTrack.getTrackLabel();
                const activeCam = videoDevices.find(d => d.label === label);
                if (activeCam) this.selectedCameraId.set(activeCam.deviceId);
            }
            if (this.localAudioTrack) {
                const label = this.localAudioTrack.getTrackLabel();
                const activeMic = audioDevices.find(d => d.label === label);
                if (activeMic) this.selectedMicrophoneId.set(activeMic.deviceId);
            }
        } catch (err) {
            console.error("Failed to load audio/video devices:", err);
        }
    }

    async switchCamera(deviceId: string): Promise<void> {
        if (!this.localVideoTrack || this.isScreenSharing()) return;
        try {
            await this.localVideoTrack.setDevice(deviceId);
            this.selectedCameraId.set(deviceId);
        } catch (err) {
            console.error("Failed to switch camera device:", err);
        }
    }

    async switchMicrophone(deviceId: string): Promise<void> {
        if (!this.localAudioTrack) return;
        try {
            await this.localAudioTrack.setDevice(deviceId);
            this.selectedMicrophoneId.set(deviceId);
        } catch (err) {
            console.error("Failed to switch microphone device:", err);
        }
    }

    async toggleScreenShare(): Promise<void> {
        if (!this.isPublishing()) return;

        if (!this.isScreenSharing()) {
            try {
                this.localScreenTrack = await AgoraRTC.createScreenVideoTrack({
                    encoderConfig: "1080p_1"
                }, "auto");

                this.localScreenTrack.on("track-ended", () => {
                    this.stopScreenShare();
                });

                if (this.localVideoTrack) {
                    await this.agoraRtcClient.unpublish(this.localVideoTrack);
                }
                await this.agoraRtcClient.publish(this.localScreenTrack);

                const container = document.getElementById('local-player');
                if (container) {
                    container.innerHTML = '';
                    this.localScreenTrack.play(container);
                }

                this.isScreenSharing.set(true);
            } catch (err) {
                console.error("Failed to share screen:", err);
            }
        } else {
            await this.stopScreenShare();
        }
    }

    async stopScreenShare(): Promise<void> {
        if (!this.isScreenSharing()) return;
        try {
            if (this.localScreenTrack) {
                await this.agoraRtcClient.unpublish(this.localScreenTrack);
                this.localScreenTrack.close();
                this.localScreenTrack = undefined;
            }

            if (this.localVideoTrack) {
                await this.agoraRtcClient.publish(this.localVideoTrack);
                const container = document.getElementById('local-player');
                if (container) {
                    container.innerHTML = '';
                    this.localVideoTrack.play(container);
                }
            }
            this.isScreenSharing.set(false);
        } catch (err) {
            console.error("Failed to stop screen share:", err);
        }
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
        clearInterval(this.timerInterval);
        clearInterval(this.statsInterval);

        if (this.localScreenTrack) {
            this.localScreenTrack.close();
            this.localScreenTrack = undefined;
        }
        this.localVideoTrack?.close();
        this.localAudioTrack?.close();
        
        await this.agoraRtcClient.unpublish();
        await this.agoraRtcClient.leave();
        
        this.isPublishing.set(false);
        this.isScreenSharing.set(false);
        this.networkQuality.set(0);
        this.videoBitrate.set(0);
        this.videoFps.set(0);
        this.videoResolution.set('N/A');
        this.chatMessages.set([]);
    }
}