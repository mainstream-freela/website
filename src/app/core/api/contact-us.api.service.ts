import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ContactUsContract } from "@core/contracts/contact-us.contract";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpErrorCatcher } from "./http-error-catcher";

@Injectable({
    providedIn: 'root'
})
export class ContactUsApiService extends HttpErrorCatcher{

    constructor(private http: HttpClient) {
        super();
    }

    contact(body: ContactUsContract): Observable<any>{
        const headers = new HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(`${environment.mailme}`, body, { headers, observe: 'response' }).pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => null);
            })
        );
    }

}