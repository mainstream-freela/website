import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventDetails } from '@core/contracts/event-details.contract';
import { SearchTerm } from '@core/contracts/search-term.contract';
import { Event, PaginatedEventResponse } from '@core/models/event.model';
import { Location } from '@core/models/location.model';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpErrorCatcher } from './http-error-catcher';

@Injectable({
  providedIn: 'root'
})
export class EventsApiService extends HttpErrorCatcher {

  constructor(private http: HttpClient) {
    super();
  }

  public all(page: number, per_page: number): Observable<PaginatedEventResponse>{
    return this.http.get<any>(`${environment.server}/api/v1/events?page=${page}&per_page=${per_page}`)
    .pipe(
      catchError(error => {
        this.connectionError(error);
        return [];
      })
    );
  }

  public search(searchTerms: SearchTerm, page: number, per_page: number): Observable<PaginatedEventResponse>{
    let params = new HttpParams();
    Object.entries(searchTerms).forEach(([key, value]) => {
      if(value !== undefined && value !== null && value !== ''){
        params = params.set(key, value);
      }
    });
    return this.http.get<any>(`${environment.server}/api/v1/events/search?page=${page}&per_page=${per_page}`, { params })
    .pipe(
      catchError(error => {
        this.connectionError(error);
        return [];
      })
    );
  }

  public event(slug: string, recommended_limit?: number): Observable<EventDetails>{
    let recommended_events_limit: string = '';

    if(recommended_limit){
      recommended_events_limit = `?recommended_events_limit=${recommended_limit}`;
    }

    return this.http.get<any>(`${environment.server}/api/v1/events/show/${slug + recommended_events_limit}`)
    .pipe(
      map((response) => {
        this.view(response.event.uuid).subscribe();
        return response;
      }),
      map((response) => ({
        ...response,
        event: [response.event],
      })),
      catchError(error => {
        this.connectionError(error);
        return throwError(() => error)
      })
    );
  }

  public view(uuid: string): Observable<any>{
    return this.http.post<any>(`${environment.server}/api/v1/events/${uuid}/view`, {}).pipe(
      catchError(error => {
        this.connectionError(error);
        return throwError(() => null)
      })
    )
  }

  public locations(): Observable<Location[]>{
    return this.http.get<any>(`${environment.server}/api/v1/events/locations`)
    .pipe(
      map(response => response.data),
      catchError(error => {
        this.connectionError(error);
        return [];
      })
    );
  }

  public byCategory(slug: string, page: number, per_page: number): Observable<PaginatedEventResponse>{
    return this.http.get<any>(`${environment.server}/api/v1/events/category/${slug}?page=${page}&per_page=${per_page}`)
    .pipe(
      catchError(error => {
        this.connectionError(error);
        return [];
      })
    );
  }

  public byTag(slug: string): Observable<PaginatedEventResponse>{
    return this.http.get<any>(`${environment.server}/api/v1/events/tag/${slug}`)
    .pipe(
      catchError(error => {
        this.connectionError(error);
        return [];
      })
    );
  }

  public bySeller(ide: string): Observable<PaginatedEventResponse>{
    return this.http.get<any>(`${environment.server}/api/v1/events/advertiser/${ide}`)
    .pipe(
      catchError(error => {
        this.connectionError(error);
        return [];
      })
    );
  }

}
