import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Event } from '@core/models/event.model';

@Component({
  selector: 'app-event',
  imports: [ RouterLink ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {
  event = input.required<Event>();
  isLoading = input.required<boolean>();
}
