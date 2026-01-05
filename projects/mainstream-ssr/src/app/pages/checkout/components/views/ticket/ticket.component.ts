import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutContract } from '@core/contracts/checkout.contract';
import { AoMoneyFormatPipe } from '@shared/pipes/ao-money-format.pipe';
import { CustomNumberInputComponent } from "@shared/ui/custom-number-input/custom-number-input.component";

@Component({
  selector: 'app-ticket',
  imports: [CustomNumberInputComponent, FormsModule, AoMoneyFormatPipe],
  template: `
    <div class="section-content">
      <div class="limited-container flex flex-col gap-6 py-16">

        @for (checkout of checkouts(); track $index) {
          <div data-aos="fade-up" data-aos-delay="0" class="ticket-details bg-[#FFECF0] px-7 py-5 rounded-lg flex flex-col lg:flex-row gap-5 lg:gap-3 justify-between items-start lg:items-center">
            <div class="event-details max-w-[476px] flex flex-col gap-5 lg:gap-3">
              <h4 class="text-xl leading-[120%]">
                {{ checkout.event.title }}
              </h4>
              <p class="text-(color:--secondary) !font-['Montserrat'] text-sm leading-[120%] -tracking-[2%]" [innerHTML]="checkout.event.description">
              </p>
              <div class="event-locations flex flex-wrap gap-3 justify-start items-center">
                <div class="date flex gap-3 justify-start items-center">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.9216 9.56003H18.52V8.60003C18.52 8.51516 18.4863 8.43377 18.4263 8.37376C18.3663 8.31374 18.2849 8.28003 18.2 8.28003C18.1152 8.28003 18.0338 8.31374 17.9738 8.37376C17.9137 8.43377 17.88 8.51516 17.88 8.60003V9.56003H12.12V8.60003C12.12 8.51516 12.0863 8.43377 12.0263 8.37376C11.9663 8.31374 11.8849 8.28003 11.8 8.28003C11.7152 8.28003 11.6338 8.31374 11.5738 8.37376C11.5137 8.43377 11.48 8.51516 11.48 8.60003V9.56003H10.0784C9.60146 9.56003 9.14403 9.7495 8.80677 10.0868C8.4695 10.424 8.28003 10.8815 8.28003 11.3584V19.9216C8.28003 20.3986 8.4695 20.856 8.80677 21.1933C9.14403 21.5306 9.60146 21.72 10.0784 21.72H19.9216C20.3986 21.72 20.856 21.5306 21.1933 21.1933C21.5306 20.856 21.72 20.3986 21.72 19.9216V11.3584C21.72 10.8815 21.5306 10.424 21.1933 10.0868C20.856 9.7495 20.3986 9.56003 19.9216 9.56003ZM10.0784 10.2H19.9216C20.2289 10.2 20.5235 10.3221 20.7407 10.5393C20.958 10.7566 21.08 11.0512 21.08 11.3584V12.12H8.92003V11.3584C8.92003 11.0512 9.04207 10.7566 9.25932 10.5393C9.47656 10.3221 9.7712 10.2 10.0784 10.2ZM19.9216 21.08H10.0784C9.7712 21.08 9.47656 20.958 9.25932 20.7407C9.04207 20.5235 8.92003 20.2289 8.92003 19.9216V12.76H21.08V19.9216C21.08 20.2289 20.958 20.5235 20.7407 20.7407C20.5235 20.958 20.2289 21.08 19.9216 21.08Z" fill="#F20530"/>
                    <circle cx="15" cy="15" r="14.5" stroke="#FFC4C4"/>
                  </svg>
                  <span class="!font-['Montserrat'] text-(color:--secondary) text-base leading-[120%] -tracking-[2%]">
                    {{ checkout.event.formatted_date }}
                  </span>
                </div>
                <div class="time flex gap-3 justify-start items-center">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="14.5" stroke="#FFC4C4"/>
                    <path d="M15.0174 11.5496C13.7256 11.5496 12.6748 12.6006 12.6748 13.8923C12.6748 15.184 13.7256 16.2349 15.0174 16.2349C16.3091 16.2349 17.3599 15.184 17.3599 13.8923C17.3599 12.6006 16.3091 11.5496 15.0174 11.5496ZM15.0174 15.6724C14.0357 15.6724 13.2373 14.8738 13.2373 13.8923C13.2373 12.9107 14.0357 12.1121 15.0174 12.1121C15.999 12.1121 16.7974 12.9107 16.7974 13.8923C16.7974 14.8738 15.999 15.6724 15.0174 15.6724Z" fill="#F20530"/>
                    <path d="M15.0173 8.53125C12.0612 8.53125 9.65625 10.9362 9.65625 13.8923C9.65625 16.789 14.6169 21.3314 14.8281 21.5233C14.8819 21.572 14.9495 21.5965 15.0173 21.5965C15.0851 21.5965 15.1527 21.572 15.2065 21.5233C15.4178 21.3314 20.3784 16.789 20.3784 13.8923C20.3784 10.9362 17.9734 8.53125 15.0173 8.53125ZM15.0173 20.9301C14.106 20.0663 10.2188 16.2427 10.2188 13.8923C10.2188 11.2464 12.3712 9.09375 15.0173 9.09375C17.6634 9.09375 19.8159 11.2464 19.8159 13.8923C19.8159 16.2427 15.9286 20.0663 15.0173 20.9301Z" fill="#F20530"/>
                  </svg>
                  <span class="!font-['Montserrat'] text-(color:--secondary) text-base leading-[120%] -tracking-[2%]">
                    {{ checkout.event.time }}
                  </span>
                </div>
                <div class="location flex gap-3 justify-start items-center">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="14.5" stroke="#FFC4C4"/>
                    <path d="M15.0174 11.5496C13.7256 11.5496 12.6748 12.6006 12.6748 13.8923C12.6748 15.184 13.7256 16.2349 15.0174 16.2349C16.3091 16.2349 17.3599 15.184 17.3599 13.8923C17.3599 12.6006 16.3091 11.5496 15.0174 11.5496ZM15.0174 15.6724C14.0357 15.6724 13.2373 14.8738 13.2373 13.8923C13.2373 12.9107 14.0357 12.1121 15.0174 12.1121C15.999 12.1121 16.7974 12.9107 16.7974 13.8923C16.7974 14.8738 15.999 15.6724 15.0174 15.6724Z" fill="#F20530"/>
                    <path d="M15.0173 8.53125C12.0612 8.53125 9.65625 10.9362 9.65625 13.8923C9.65625 16.789 14.6169 21.3314 14.8281 21.5233C14.8819 21.572 14.9495 21.5965 15.0173 21.5965C15.0851 21.5965 15.1527 21.572 15.2065 21.5233C15.4178 21.3314 20.3784 16.789 20.3784 13.8923C20.3784 10.9362 17.9734 8.53125 15.0173 8.53125ZM15.0173 20.9301C14.106 20.0663 10.2188 16.2427 10.2188 13.8923C10.2188 11.2464 12.3712 9.09375 15.0173 9.09375C17.6634 9.09375 19.8159 11.2464 19.8159 13.8923C19.8159 16.2427 15.9286 20.0663 15.0173 20.9301Z" fill="#F20530"/>
                  </svg>
                  <span class="!font-['Montserrat'] text-(color:--secondary) text-base leading-[120%] -tracking-[2%]">
                    {{ checkout.event.location.name }}
                  </span>
                </div>
              </div>
            </div>
            <div class="quantity flex gap-7 items-center">
              <span class="!font-['Montserrat'] text-base">Adicionar</span>
              <app-custom-number-input name="quantity" [(ngModel)]="checkouts()[$index].quantity" [min]="1" [max]="99" />
            </div>
            <div class="total w-full min-w-[257px] lg:w-fit flex gap-5 items-center">
                <p class="type text-base !font-['Montserrat']">Total: </p>
                <p class="price font-bold !font-['Inter] text-2xl">{{ checkouts()[$index].ticket.price * checkout.quantity | aoMoneyFormat }} KZ</p>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: ``
})
export class TicketComponent {
  checkouts = input.required<CheckoutContract[]>();
}
