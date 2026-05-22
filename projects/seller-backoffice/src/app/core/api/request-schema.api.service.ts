import { HttpClient, HttpHeaders, HttpStatusCode } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { PopUp, PopupStatus } from "@seller-backoffice-core/libs/popup/popup.service";
import { UserService } from "@seller-backoffice-core/services/user.service";
import { environment } from "@seller-backoffice-environments/environment";
import { catchError, map, Observable, of, tap, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class HttpRequestSchema {

    private http = inject(HttpClient);
    private userService = inject(UserService);
    private alertService = inject(PopUp);

    private headers: HttpHeaders = new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.userService.storedToken,
    });

    public get<T>(uri: string,
        options: any = { endpoint: environment.server }
    ): Observable<T>{

        const hdrs = options.headers ? this.appendOrReplaceHeaders(options.headers) : this.headers;

        return this.http.get<T>(`${options.endpoint }/${ uri }`, { headers: hdrs })
        .pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => error)
            })
        )
    }

    public post<T>(uri: string, body: any,
        options: any = { endpoint: environment.server }
    ): Observable<T>{

        let localHeaders: HttpHeaders = this.appendOrReplaceHeaders({
            ...(options.headers instanceof HttpHeaders ? this.headersToObject(options.headers) : options.headers)
        });

        return this.http.post<T>(`${ options.endpoint }/${ uri }`, body, { headers: localHeaders })
        .pipe(
            catchError(error => {
                this.connectionError(error);
                return throwError(() => error)
            })
        )
    }

    private headersToObject(headers: HttpHeaders): Record<string, string>{
        const object: Record<string, string> = {};
        headers.keys().forEach(key => {
            const value = headers.get(key);
            if(value !== null) object[key] = value;
        });
        return object;
    }

    private appendOrReplaceHeaders(headers: { [name: string]: string }): HttpHeaders { 
        let hdrs: HttpHeaders = this.headers;
        for(let key in headers){
            hdrs = hdrs.set(key, headers[key]);
        }
        return hdrs;
    }

    private connectionError(error: any): void{
        switch(error.status){
            case 0:
                this.alertService.add("Não é possível manter a comunicação com o servidor", PopupStatus.ERROR)
                break;

            case HttpStatusCode.Unauthorized:
                this.alertService.add("Sua sessão expirou. Entre novamente na sua conta.", PopupStatus.ERROR);
                this.userService.unAuthenticate();
                break;

            case HttpStatusCode.Forbidden:
                if(error.error.message) {
                    this.alertService.add(error.error.message, PopupStatus.ERROR);
                }
                break;
            
            default:
                this.alertService.add("Não foi possível concluir com o teu pedido neste momento", PopupStatus.ERROR)
                break;
        }
    }
}