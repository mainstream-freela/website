import { NgClass } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PaginatedPage } from '@core/classes/paginated-page.class';
import { CategoryFacade } from '@core/facades/category.facade';
import { EventFacade } from '@core/facades/event.facade';
import { LocationFacade } from '@core/facades/location.facade';
import { Category } from '@core/models/category.model';
import { Event } from '@core/models/event.model';
import { Location } from '@core/models/location.model';
import { DisplayerComponent as EventDisplayer } from '@shared/components/events/displayer/displayer.component';
import { SearchComponent } from '@shared/components/events/search/search.component';
import { PageHeadComponent } from '@shared/components/page-head/page-head.component';

@Component({
  selector: 'app-events',
  imports: [ RouterLink, PageHeadComponent, SearchComponent, EventDisplayer, NgClass ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent extends PaginatedPage implements OnInit {
  
  eventFacade = inject(EventFacade);
  categoryFacade = inject(CategoryFacade);
  locationFacade = inject(LocationFacade);

  activatedRoute = inject(ActivatedRoute);

  categories: WritableSignal<Category[]> = signal([]);
  locations: WritableSignal<Location[]> = signal([]);
  
  events: WritableSignal<Event[]> = signal([]);
  selectedCategory: WritableSignal<string | undefined> = signal(undefined);

  ngOnInit(): void {
    this.getCategories();
    this.getLocations();

    this.activatedRoute.paramMap.subscribe(params => {
      const category = params.get('category');
      this.isLoadingEvents.set(true);
      this.events.set([]);

      if(category){
        this.selectedCategory.set(category);
        this.getEventsByCategory(category);

      } else {
        this.selectedCategory.set(undefined);
        this.getEvents();
      }
    });
  }

  public loadMoreEvents(): void{
      if(!this.hasLoadMoreButtonAppear()) return;
      this.currentPage.update(val => val + 1);

      if(this.selectedCategory()){
        this.getEventsByCategory(this.selectedCategory()!, this.currentPage())

      } else {
        this.getEvents(this.currentPage());
      }
  }

  private getCategories(): void{
    this.categoryFacade.all().subscribe(categories => this.categories.set(categories));
  }

  private getLocations(): void{
    this.locationFacade.all().subscribe(locations => this.locations.set(locations));
  }

  private getEvents(current_page: number = this.currentPage()): void{
    this.isLoadingEvents.set(true);
    this.eventFacade.latest(current_page, this.limit()).subscribe({
      next: events => {

        if(events.next_page_url !== null){
          this.hasLoadMoreButtonAppear.set(true);
        } else {
          this.hasLoadMoreButtonAppear.set(false);
        }

        this.events.set([...this.events(), ...events.data])
        this.isLoadingEvents.set(false);
      }
    });
  }

  private getEventsByCategory(category: string, current_page: number = this.currentPage()): void{
    this.isLoadingEvents.set(true);
    this.eventFacade.byCategory(category, current_page, this.limit()).subscribe({
      next: events => {

        if(events.next_page_url !== null){
          this.hasLoadMoreButtonAppear.set(true);
        } else {
          this.hasLoadMoreButtonAppear.set(false);
        }

        this.events.set([...this.events(), ...events.data])
        this.isLoadingEvents.set(false);
      }
    });
  }
}
