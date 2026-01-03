import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateAdvertiserContract } from "@core/contracts/create-advertiser.contract";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpErrorCatcher } from "./http-error-catcher";

@Injectable({
    providedIn: 'root'
})
export class AdvertiserApiService extends HttpErrorCatcher{

    constructor(private http: HttpClient) {
        super();
    }

    create(advertiser: CreateAdvertiserContract): Observable<any>{
        return this.http.post<any>(`${environment.server}/api/v1/sellers/store`, advertiser, { observe: 'response' }).pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => error);
            })
        );
    }

}
