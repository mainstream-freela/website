import { inject, Injectable } from "@angular/core";
import { EventsApiService } from "@core/api/events.api.service";
import { EventsData } from "@core/data/events.data";
import { Event, PaginatedEventResponse } from "@core/models/event.model";
import { map, Observable, of, switchMap, take, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventFacade{
    private dataContainer = inject(EventsData);
    private api = inject(EventsApiService);

    public latest(page: number, per_page: number): Observable<PaginatedEventResponse>{
        return this.dataContainer.getPaginatedData(page).pipe(
            take(1),
            switchMap(response => {
                if(!(response.length > 0)){
                    return this.api.all(page, per_page).pipe(
                        map(incoming => {
                            this.dataContainer.insertWithPagination([incoming], page);
                            return incoming;
                        })
                    );
                }

                return of(response[0]);
            })
        )
    }

    public byCategory(category: string, page: number, per_page: number): Observable<PaginatedEventResponse>{
        return this.dataContainer.getPaginatedWithCategoryFilter(category, page).pipe(
            take(1),
            switchMap(response => {
                if(!(response.length > 0)){
                    return this.api.byCategory(category, page, per_page).pipe(
                        map(incoming => {
                            this.dataContainer.insertWithCategoryFilter([incoming], category, page);
                            return incoming;
                        })
                    );
                }

                return of(response[0]);
            })
        );
    }
}