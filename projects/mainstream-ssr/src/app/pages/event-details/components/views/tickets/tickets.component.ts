import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Event } from '@core/models/event.model';
import { Ticket } from '@core/models/ticket.model';
import { CheckoutService } from '@libraries/checkout/checkout.service';
import { AoMoneyFormatPipe } from '@shared/pipes/ao-money-format.pipe';
import { CustomNumberInputComponent } from '@shared/ui/custom-number-input/custom-number-input.component';
@Component({
  selector: 'app-tickets',
  imports: [FormsModule, CustomNumberInputComponent],
  template: `
    <div class="section-content">
      <div class="limited-container flex flex-col gap-7 py-16">

        @if(!isLoading()){
          @for (ticket of tickets(); track $index) {
            <div data-aos="fade-right" [attr.data-aos-delay]="$index * 200" class="ticket flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center px-7 py-5 rounded-lg bg-[#FFECF0]">
              <div class="info flex gap-7 items-center">
                <p class="type text-base !font-['Montserrat'] min-w-[100px] uppercase">{{ ticket.type }}</p>
                <p class="price font-bold !font-['Inter] text-2xl">{{ ticket.formatted_price }} KZ</p>
              </div>
              <div class="quantity flex gap-7 items-center">
                <span class="!font-['Montserrat'] text-base">Adicionar</span>
                <app-custom-number-input name="quantity" [(ngModel)]="ticketsAvailableToCheckout()[$index].quantity" [min]="1" [max]="99" />
              </div>
              <div class="cta w-full min-w-[157px] lg:w-fit">
                <button (click)="this.addToCheckout(ticket, ticketsAvailableToCheckout()[$index].quantity)" class="bg-(color:--primary) cursor-pointer text-white w-full py-4 px-7 rounded !font-['Montserrat'] text-base flex gap-4 justify-center items-center">
                  Comprar
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="30" width="30" height="30" rx="15" transform="rotate(90 30 0)" fill="#FFECF0"/>
                    <path d="M22.4831 19.582L6.77762 19.2849C6.58471 19.2812 6.43151 19.1221 6.43515 18.9292L6.58397 11.0633C6.58762 10.8704 6.74674 10.7172 6.93964 10.7209L22.6446 11.018C22.8376 11.0217 22.9908 11.1808 22.9871 11.3737L22.934 14.1829C22.9303 14.3758 22.7712 14.529 22.5783 14.5253C22.1522 14.5173 21.7997 14.858 21.7916 15.285C21.7835 15.7119 22.1234 16.0658 22.549 16.0738C22.7419 16.0775 22.8951 16.2366 22.8915 16.4295L22.8383 19.2387C22.8351 19.4324 22.676 19.5857 22.4831 19.582ZM7.14034 18.5929L22.1468 18.8768L22.1875 16.7242C21.5475 16.5546 21.0799 15.9638 21.093 15.2722C21.1061 14.5806 21.5956 14.0079 22.2416 13.8626L22.2824 11.71L7.27593 11.4261L7.14034 18.5929Z" fill="#F20530"/>
                    <path d="M19.5894 12.3868C19.3965 12.3831 19.2433 12.224 19.2469 12.0311L19.2576 11.4694C19.2612 11.2765 19.4203 11.1233 19.6132 11.127C19.8061 11.1306 19.9593 11.2897 19.9557 11.4826L19.9451 12.0443C19.9414 12.2372 19.7823 12.3904 19.5894 12.3868Z" fill="#F20530"/>
                    <path d="M19.5454 14.7108C19.3525 14.7071 19.1993 14.548 19.203 14.3551L19.2136 13.7935C19.2173 13.6006 19.3764 13.4474 19.5693 13.451C19.7622 13.4547 19.9154 13.6138 19.9117 13.8067L19.9011 14.3683C19.8975 14.5612 19.7384 14.7144 19.5454 14.7108Z" fill="#F20530"/>
                    <path d="M19.5015 17.0348C19.3086 17.0312 19.1554 16.8721 19.159 16.6792L19.1697 16.1175C19.1733 15.9246 19.3324 15.7714 19.5253 15.775C19.7182 15.7787 19.8715 15.9378 19.8678 16.1307L19.8572 16.6924C19.8535 16.8853 19.6944 17.0385 19.5015 17.0348Z" fill="#F20530"/>
                    <path d="M19.4576 19.3589C19.2647 19.3552 19.1114 19.1961 19.1151 19.0032L19.1257 18.4416C19.1294 18.2486 19.2885 18.0954 19.4814 18.0991C19.6743 18.1027 19.8275 18.2619 19.8239 18.4548L19.8132 19.0164C19.8096 19.2093 19.6505 19.3625 19.4576 19.3589Z" fill="#F20530"/>
                  </svg>
                </button>
              </div>
            </div>
          } @empty {
            <p class="font-medium text-center w-full">Não foram encontrados ingressos para este evento</p>
          }

        } @else {
          <div class="ticket flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center px-7 py-5 rounded-lg bg-[#FFECF0]">
            <div class="info flex gap-7 items-center">
              <p class="type text-base placeholder !relative !w-fit text-transparent !font-['Montserrat'] min-w-[100px] uppercase">Placeholder</p>
              <p class="price font-bold placeholder !relative !w-fit text-transparent !font-['Inter] text-2xl">Placeholder price</p>
            </div>
            <div class="quantity flex gap-7 items-center">
              <span class="!font-['Montserrat'] text-base">Adicionar</span>
              <app-custom-number-input name="quantity" [min]="1" [max]="99" />
            </div>
            <div class="cta w-full min-w-[157px] lg:w-fit">
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: ``
})
export class TicketsComponent implements OnInit {

  event = input.required<Event[]>();
  isLoading = input.required<boolean>();
  checkoutService = inject(CheckoutService);
  router = inject(Router);

  tickets = computed(() => {
    if(this.event().length > 0){
      return this.event()[0].tickets
    } else {
      return [];
    }
  });

  ticketsAvailableToCheckout = computed(() => {
    return this.tickets().flatMap(ticket => ({ event: this.event(), ticket: ticket, quantity: 1 }))
  });

  addToCheckout(ticket: Ticket, quantity: number): void{
    this.checkoutService.addItem({
      event: this.event()[0],
      ticket: ticket,
      quantity: quantity
    });
    
    this.navigateToCheckout();
  }

  private navigateToCheckout(): void{
    this.router.navigate(['/checkout']);
  }

  ngOnInit(): void {
    // console.log(this.ticketsAvailableToCheckout());
  }

}
