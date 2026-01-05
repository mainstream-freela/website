import { HttpClient, HttpStatusCode } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AgoraUid, IdentificateGuest, JoinLiveEvent, LiveAccessResponse, PaidEventsForIdentifiedGuests } from "@core/contracts/live.contract";
import { AgoraUidStorage } from "@core/data/agora-uid.data";
import { LiveAccessFacade } from "@core/facades/live.facade";
import { response } from "express";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpErrorCatcher } from "./http-error-catcher";

@Injectable({
    providedIn: 'root'
})
export class LiveApiService extends HttpErrorCatcher {
    private http = inject(HttpClient);

    getEventsPaiedByGuest(guest: IdentificateGuest): Observable<PaidEventsForIdentifiedGuests[]>{
        return this.http.post<PaidEventsForIdentifiedGuests[]>(`${ environment.server }/api/v1/live/guest/access/available-events`, guest)
                        .pipe(
                            catchError(error => {
                                this.connectionError(error);
                                return throwError(() => error);
                            })
                        );
    }

    joinToEvent(data: JoinLiveEvent): Observable<LiveAccessResponse>{
        data = { ...data, previousUid: AgoraUidStorage.get(data.event, 'audience') }
        return this.http.post<LiveAccessResponse>(`${ environment.server }/api/v1/live/guest/access/join`, data).pipe(
            map((response: any) => {
                if(response.status && response.status === HttpStatusCode.Ok){
                    AgoraUidStorage.set(data.event, 'audience', response.data.streaming.uid);
                }

                return response.data;
            }),
            catchError(error => {
                this.connectionError(error);
                return throwError(() => null);
            })
        );
    }

    ping(data: AgoraUid): Observable<any>{
        return this.http.post<any>(`${ environment.server }/api/v1/live/guest/access/ping`, data).pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => null);
            })
        );
    }

    leave(data: AgoraUid): Observable<any>{
        return this.http.post<any>(`${ environment.server }/api/v1/live/guest/access/leave`, data).pipe(
            map(response => {
                console.log(response);
                if(response.status === HttpStatusCode.Ok){
                    console.log("Event Uid -> ", response.event);
                    AgoraUidStorage.remove(response.event, 'audience');
                }
            }),
            catchError(error => {
                this.connectionError(error);
                return throwError(() => null);
            })
        );
    }
}