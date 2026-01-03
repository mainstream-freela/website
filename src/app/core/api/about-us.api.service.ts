import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AboutUs, Faq } from "@core/models/about-us.model";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpErrorCatcher } from "./http-error-catcher";

@Injectable({
    providedIn: 'root'
})
export class AboutUsApiService extends HttpErrorCatcher{
    constructor(private http: HttpClient) {
        super();
    }

    public faqs(): Observable<Faq[]>{
        return this.http.get<any>(`${environment.server}/api/v1/faqs/${environment.vendor}?order=asc`)
        .pipe(
            map(response => response.data),
            catchError(error => {
                this.connectionError(error);
                return throwError(() => error);
            })
        );
    }

    public about(): Observable<AboutUs>{
        return this.http.get<any>(`${environment.server}/api/v1/about-us/${environment.vendor}`)
        .pipe(
            map(response => response.data),
            catchError(error => {
                this.connectionError(error);
                return throwError(() => null);
            })
        );
    }

}