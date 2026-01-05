import { LiveApiService } from "@core/api/live.api.service";
import { AgoraUidStorage } from "@core/data/agora-uid.data";
import { LiveAccessFacade } from "@core/facades/live.facade";

export function liveAccessProviders(): any[]{
    return [
        AgoraUidStorage,
        LiveApiService,
        LiveAccessFacade
    ];
}