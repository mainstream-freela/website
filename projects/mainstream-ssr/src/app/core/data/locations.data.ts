import { Injectable } from "@angular/core";
import { Location } from "@core/models/location.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class LocationsData{
    private locationsContainer: BehaviorSubject<Location[]> = new BehaviorSubject<Location[]>([]);

    public insert(data: Location[]): void{
        this.locationsContainer.next(data);
    }

    public get locations(): Observable<Location[]>{
        return this.locationsContainer.asObservable();
    }

}