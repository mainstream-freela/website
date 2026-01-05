import { inject, Injectable, Signal, signal } from "@angular/core";
import { LiveApiService } from "@core/api/live.api.service";
import { AgoraUid } from "@core/contracts/live.contract";
import { Event } from "@core/models/event.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StreamService {
    private api = inject(LiveApiService);
    private readonly EventInLive = signal<Event[]>([]);

    set eventInLive(event: Event) {
        this.EventInLive.set([ event ]);
    }

    get eventInLive(): Signal<Event[]>{
        return this.EventInLive;
    }

    ping(data: AgoraUid): Observable<any>{
        return this.api.ping(data).pipe();
    }

    leave(data: AgoraUid): Observable<any>{
        return this.api.leave(data).pipe();
    }
}