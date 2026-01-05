import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Category } from "@core/models/category.model";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpErrorCatcher } from "./http-error-catcher";

@Injectable({
    providedIn: 'root'
})
export class CategoriesApiService extends HttpErrorCatcher{

    constructor(private http: HttpClient){
        super();
    }

    public all(): Observable<Category[]>{
        return this.http.get<any>(`${environment.server}/api/v1/categories?order_by=events`)
        .pipe(
            map(response => response.data),
            catchError(error => {
                this.connectionError(error);
                return [];
            })
        );
    }

}