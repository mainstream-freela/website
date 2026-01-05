import { Component, input } from '@angular/core';
import { Event } from '@core/models/event.model';
import { DisplayerComponent } from '@shared/components/events/displayer/displayer.component';

@Component({
  selector: 'app-recommended',
  imports: [ DisplayerComponent ],
  template: `
    <app-events-displayer [isLoading]="this.isLoading()" [limit]="limit()" [button]="{ visible: false }" [paginated]="false" [events]="events()">
        <div class="section-header flex flex-col gap-[50px]" ngProjectAs="section-header">
            <div class="content flex flex-col gap-12">
                <div class="title text-left flex flex-col items-start gap-2">
                    <h6 class="text-base xl:text-xl !font-['Montserrat']">
                      Mais eventos que podem te interessar
                    </h6>
                    <h1 class="font-semibold text-2xl xl:max-w-[550px] xl:text-4xl !font-['Unigeo']">
                      Garanta seu ingresso agora mesmo!
                    </h1>
                </div>
            </div>
        </div>
    </app-events-displayer>
  `,
  styles: ``
})
export class RecommendedComponent {
  events = input.required<Event[]>();
  isLoading = input.required<boolean>();
  limit = input.required<number>();
}
