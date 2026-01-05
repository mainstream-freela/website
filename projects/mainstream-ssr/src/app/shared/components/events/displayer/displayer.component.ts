import { Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from '@core/models/event.model';
import { EventComponent } from '@shared/templates/event/event.component';
import { EventTemplatePlaceholderComponent } from '@shared/templates/event/placeholder/event-template-placeholder.component';

@Component({
  selector: 'app-events-displayer',
  imports: [ EventComponent, EventTemplatePlaceholderComponent ],
  template: `
    <div class="section-content py-16">
      <div class="limited-container flex flex-col gap-[50px]">
          <ng-content select="section-header"></ng-content>

          <div class="events-container flex flex-col flex-wrap md:flex-row gap-[30px] md:gap-4 lg:gap-[30px] justify-start items-stretch">
              @if(!this.paginated()){
                @if(!this.isLoading()){
                  @for (event of events(); track $index) {
                      <app-event
                      data-aos="fade-up" [attr.data-aos-delay]="$index * 200"
                      class="w-full md:w-[355px] lg:w-[370px] xl-1230:!w-[calc(calc(100%/3)-20px)]"
                      [event]="event"
                      [isLoading]="this.isLoading()"
                      />
                  } @empty {
                    <p class="font-medium text-center w-full">Não foram encontrados eventos para mostrar</p> 
                  }

                } @else {
                  <!-- <p class="font-medium text-center w-full">A carregar informações...</p> -->
                  <!-- <img class="w-9 h-9 mx-auto" src="assets/static/loader-primary.svg" alt="A carregar..." /> -->
                  @for (placeholder of placeholderLimited(); track $index) {
                    <app-event-template-placeholder
                    class="w-full md:w-[355px] lg:w-[370px] xl-1230:!w-[calc(calc(100%/3)-20px)]"
                    />
                  }
                }
              } @else {
                @for (event of events(); track $index) {
                    <app-event
                    data-aos="fade-up" [attr.data-aos-delay]="$index * 200"
                    class="w-full appear-softly-from-bott md:w-[355px] lg:w-[370px] xl-1230:!w-[calc(calc(100%/3)-20px)]"
                    [event]="event"
                    [isLoading]="this.isLoading()"
                    />
                } @empty {
                  @if(!this.isLoading()){
                    <p class="font-medium text-center w-full">Não foram encontrados eventos para mostrar</p> 
                  }
                }
              }
          </div>
          @if (button().visible && (!this.isLoading() && events().length >= limit())) {
            <div data-aos="fade-up" class="see-more flex justify-center">
                <button type="button" (click)="this.onButtonClick()" class="duration-[.3s] text-white hover:text-(color:--primary) bg-(color:--primary) hover:bg-white hover:border-1 hover:border-(color:--primary) w-full xl:w-fit cursor-pointer font-medium rounded-lg !font-['Montserrat'] text-sm px-7 py-6">
                    {{ button().label }}
                </button>
            </div>
          }

          @if(this.isLoading() && paginated()){
            <img class="w-9 h-9 mx-auto" src="assets/static/loader-primary.svg" alt="A carregar..." />
          }

      </div>
  </div>
  `,
  styles: ``
})
export class DisplayerComponent {

  paginated = input.required<boolean>();
  limit = input<number>(6);
  isLoading = input<boolean>(false);
  router = inject(Router);
  
  placeholderLimited = computed(() => Array(this.limit()));

  loadMoreEventsEmmiter = output<boolean>();

  button = input<Button>({
    visible: true,
    label: 'Ver mais Eventos',
    route: ['/events']
  });

  events = input<Event[]>([]);

  loadMoreEventsEventEmmiter(): null{
    if(!this.paginated()) return null;

    this.loadMoreEventsEmmiter.emit(true);
    return null;
  }

  onButtonClick(){

    if(!this.paginated()){
      this.router.navigate(this.button().route!);
      return;
    }

    this.loadMoreEventsEventEmmiter();
  }

}

interface Button{
  visible: boolean,
  label?: string,
  route?: string[]
}