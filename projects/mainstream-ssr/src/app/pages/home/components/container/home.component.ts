import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HeroComponent } from '../views/hero/hero.component';
import { FootComponent } from "../views/foot/foot.component";
import { SearchComponent } from '@shared/components/events/search/search.component';
import { DisplayerComponent as EventsDisplayer } from '@shared/components/events/displayer/displayer.component';
import { RouterLink } from '@angular/router';
import { CategoriesApiService } from '@core/api/categories.api.service';
import { Category } from '@core/models/category.model';
import { Event } from '@core/models/event.model';
import { Location } from '@core/models/location.model';
import { EventFacade } from '@core/facades/event.facade';
import { LocationFacade } from '@core/facades/location.facade';
import { CategoryFacade } from '@core/facades/category.facade';

@Component({
  selector: 'app-home',
  imports: [RouterLink, HeroComponent, SearchComponent, EventsDisplayer, FootComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  
  eventsFacade = inject(EventFacade);
  categoryFacade = inject(CategoryFacade);
  locationyFacade = inject(LocationFacade);

  categories: WritableSignal<Category[]> = signal([]);
  locations: WritableSignal<Location[]> = signal([]);
  
  events: WritableSignal<Event[]> = signal([]);

  isLoadingEvents = signal(true);

  limit = signal<number>(6);

  hasLoadMoreButtonAppear = signal<boolean>(false);

  ngOnInit(): void {
    this.getCategories();
    this.getLocations();
    this.getEvents();
  }

  private getCategories(): void{
    this.categoryFacade.all().subscribe(categories => this.categories.set(categories));
  }

  private getLocations(): void{
    this.locationyFacade.all().subscribe(locations => this.locations.set(locations));
  }

  private getEvents(): void{
    this.isLoadingEvents.set(true);
    this.eventsFacade.latest(1, this.limit()).subscribe({
      next: events => {
        
        if(events.next_page_url !== null){
          this.hasLoadMoreButtonAppear.set(true);
        } else {
          this.hasLoadMoreButtonAppear.set(false);
        }

        this.events.set(events.data)
        this.isLoadingEvents.set(false);
      }
    });
  } 
}
