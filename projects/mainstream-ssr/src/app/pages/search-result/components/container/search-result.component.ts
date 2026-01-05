import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { EventsApiService } from '@core/api/events.api.service';
import { PaginatedPage } from '@core/classes/paginated-page.class';
import { SearchTerm } from '@core/contracts/search-term.contract';
import { Event } from '@core/models/event.model';
import { SearchTermCatcher } from '@pages/search-result/helpers/search-term-catcher.helper';
import { DisplayerComponent as EventDisplayer } from '@shared/components/events/displayer/displayer.component';

@Component({
  selector: 'app-search-result',
  imports: [ EventDisplayer ],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css'
})
export class SearchResultComponent extends PaginatedPage implements OnInit {

  eventsClient = inject(EventsApiService);
  searchHelper = inject(SearchTermCatcher);

  events: WritableSignal<Event[]> = signal([]);

  isSearching = signal(false);

  searchTerm: SearchTerm = {};

  ngOnInit(): void {
    this.searchTerm = this.searchHelper.terms();
    this.search(this.searchTerm);
  }

  public loadMoreEvents(): void {
    if(!this.hasLoadMoreButtonAppear()) return;
    this.currentPage.update(val => val + 1);

    this.search(this.searchTerm)
  }

  search(searchTerm: SearchTerm, current_page: number = this.currentPage()): void{
    this.isSearching.set(true);
    this.eventsClient.search(searchTerm, current_page, this.limit()).subscribe({
      next: events => {

        if(events.next_page_url !== null){
          this.hasLoadMoreButtonAppear.set(true);
        } else {
          this.hasLoadMoreButtonAppear.set(false);
        }

        this.events.set(events.data)
      }
    });
  }

}
