import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HeroComponent } from '../views/hero/hero.component';
import { TicketDetailsComponent } from "../views/ticket-details/ticket-details.component";
import { TicketsComponent } from "../views/tickets/tickets.component";
import { RecommendedComponent } from "../views/recommended/recommended.component";
import { EventsApiService } from '@core/api/events.api.service';
import { ActivatedRoute } from '@angular/router';
import { Event } from '@core/models/event.model';
import { HttpStatusCode } from '@angular/common/http';
import { PageHeadComponent } from "@shared/components/page-head/page-head.component";
import { PopUp, PopupStatus } from '@libraries/popup/popup.service';

@Component({
  selector: 'app-event-details',
  imports: [HeroComponent, TicketDetailsComponent, TicketsComponent, RecommendedComponent, PageHeadComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {

  theEvent: WritableSignal<Event[]> = signal([]);
  popup = inject(PopUp);
  recommendedEvents: WritableSignal<Event[]> = signal([]);

  eventsClient = inject(EventsApiService);
  activatedRoute = inject(ActivatedRoute);

  recommendedEventsLimit = signal<number>(3);
  
  error404 = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    // this.getTheEvent();
    this.activatedRoute.paramMap.subscribe(params => {
      const slug = params.get('event');

      if(!slug){
        this.error404.set(true);
        return;
      }

      this.getTheEvent(slug);
    });
  }

  private getTheEvent(slug: string): void{
    this.isLoading.set(true);
    this.eventsClient.event(slug, this.recommendedEventsLimit()).subscribe({
      next: response => {
        this.theEvent.set(response.event);
        this.recommendedEvents.set(response.recommended);

        this.isLoading.set(false);
      },
      error: error => {
        if(error.status === HttpStatusCode.NotFound){
          this.error404.set(true);

        } else {
          this.popup.add("Ocorreu um erro ao pegar este evento.", PopupStatus.ERROR);
          this.error404.set(false);
        }

        this.isLoading.set(false);
      }
    });
  }
  
}
