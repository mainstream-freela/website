import { inject, Injectable } from "@angular/core";
import { LiveApiService } from "@core/api/live.api.service";
import { AgoraUid, IdentificateGuest, JoinLiveEvent, LiveAccessResponse, PaidEventsForIdentifiedGuests } from "@core/contracts/live.contract";
import { LiveAccessComponent } from "@pages/lives/views/live-access.component";
import { Observable } from "rxjs";

@Injectable({
    providedIn: LiveAccessComponent
})
export class LiveAccessFacade{
    private api = inject(LiveApiService);

    getEvents(guest: IdentificateGuest): Observable<PaidEventsForIdentifiedGuests[]>{
        return this.api.getEventsPaiedByGuest(guest);
    }

    join(data: JoinLiveEvent): Observable<LiveAccessResponse>{
        return this.api.joinToEvent(data);
    }

    ping(data: AgoraUid): Observable<any>{
        return this.api.ping(data);
    }

    leave(data: AgoraUid): Observable<any>{
        return this.api.leave(data);
    }
}