import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpErrorCatcher } from "./http-error-catcher";

@Injectable({
    providedIn: 'root'
})
export class StreamStats extends HttpErrorCatcher{
    private api = inject(HttpClient);

    countUsers(agora_uid: number): Observable<any>{
        return this.api.post(`${environment.server}/api/v1/live/stats/audience/count`, { agora_uid }).pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => null);
            })
        );
    }
}