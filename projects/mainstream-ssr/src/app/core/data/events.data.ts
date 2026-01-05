import { Injectable, signal } from "@angular/core";
import { Event, PaginatedEventResponse } from "@core/models/event.model";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventsData{
    
    private latestEventsContainer: BehaviorSubject<PaginatedEventResponse[]> = new BehaviorSubject<PaginatedEventResponse[]>([]);
    private paginatedEventsContainer: { [page: number]: BehaviorSubject<PaginatedEventResponse[]>} = { 0: new BehaviorSubject<PaginatedEventResponse[]>([]) };
    private paginatedWithCategoryFilterEventsContainer: { [page: number]: { [categorySlug: string]: BehaviorSubject<PaginatedEventResponse[]> } } = { 0: { '': new BehaviorSubject<PaginatedEventResponse[]>([]) } };

    public insert(data: PaginatedEventResponse[]): void{
        this.latestEventsContainer.next(data);
    }

    public get latestEvents(): Observable<PaginatedEventResponse[]>{
        return this.latestEventsContainer.asObservable();
    }

    public insertWithPagination(data: PaginatedEventResponse[], page: number): void {
        if (!this.paginatedEventsContainer[page]) {
            this.paginatedEventsContainer[page] = new BehaviorSubject<PaginatedEventResponse[]>([]);
        }

        this.paginatedEventsContainer[page].next(data);
    }

    public getPaginatedData(page: number): Observable<PaginatedEventResponse[]> {
        if (!this.paginatedEventsContainer[page]) {
            this.paginatedEventsContainer[page] = new BehaviorSubject<PaginatedEventResponse[]>([]);
        }

        return this.paginatedEventsContainer[page].asObservable();
    }

    public insertWithCategoryFilter(data: PaginatedEventResponse[], categorySlug: string, page: number): void{
        // Inicializa o page se não existir
        if (!this.paginatedWithCategoryFilterEventsContainer[page]) {
            this.paginatedWithCategoryFilterEventsContainer[page] = {};
        }

        // Inicializa o categorySlug se não existir dentro da page
        if (!this.paginatedWithCategoryFilterEventsContainer[page][categorySlug]) {
            this.paginatedWithCategoryFilterEventsContainer[page][categorySlug] = new BehaviorSubject<PaginatedEventResponse[]>([]);
        }

        // Define os dados no BehaviorSubject
        this.paginatedWithCategoryFilterEventsContainer[page][categorySlug].next(data);
    }

    public getPaginatedWithCategoryFilter(categorySlug: string, page: number): Observable<PaginatedEventResponse[]>{
        // Inicializa caso ainda não tenha sido definido
        if (!this.paginatedWithCategoryFilterEventsContainer[page]) {
            this.paginatedWithCategoryFilterEventsContainer[page] = {};
        }

        if (!this.paginatedWithCategoryFilterEventsContainer[page][categorySlug]) {
            this.paginatedWithCategoryFilterEventsContainer[page][categorySlug] = new BehaviorSubject<PaginatedEventResponse[]>([]);
        }

        return this.paginatedWithCategoryFilterEventsContainer[page][categorySlug].asObservable();
    }
}