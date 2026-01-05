import { inject, Injectable } from "@angular/core";
import { EventsApiService } from "@core/api/events.api.service";
import { LocationsData } from "@core/data/locations.data";
import { Category } from "@core/models/category.model";
import { Location } from "@core/models/location.model";
import { map, Observable, of, switchMap, take } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LocationFacade{
    private dataContainer = inject(LocationsData);
    private api = inject(EventsApiService);

    public all(): Observable<Location[]>{
        return this.dataContainer.locations.pipe(
            take(1),
            switchMap(response => {
                if(!(response.length > 0)){
                    return this.api.locations().pipe(
                        map(incoming => {
                            this.dataContainer.insert(incoming);
                            return incoming;
                        })
                    );
                }

                return of(response);
            })
        )
    }
}