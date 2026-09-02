import { inject, Injectable } from "@angular/core";
import { EventFacade } from "./events.facade";
import { Observable } from "rxjs";
import { PaginatedEventResponse } from "./events.models";
import { HttpRequestSchema } from "@seller-backoffice-core/api/request-schema.api.service";

@Injectable({
    providedIn: 'root'
})
export class EventApiService {
    private httppSchema = inject(HttpRequestSchema);
    
    events(page: number, per_page: number): Observable<PaginatedEventResponse>{
        return this.httppSchema.post<PaginatedEventResponse>(`api/v1/live/host/events?page=${page}&per_page=${per_page}`, {});
    }

    getLiveAnalytics(eventUuid: string): Observable<any>{
        return this.httppSchema.post<any>(`api/v1/live/host/events/${eventUuid}/analytics`, {});
    }
}