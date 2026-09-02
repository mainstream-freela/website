import { inject, Injectable } from "@angular/core";
import { HttpRequestSchema } from "@seller-backoffice-core/api/request-schema.api.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DashboardApiService {
    private httpSchema = inject(HttpRequestSchema);

    getDashboardStats(): Observable<any> {
        return this.httpSchema.post<any>('api/v1/live/host/dashboard', {});
    }
}
