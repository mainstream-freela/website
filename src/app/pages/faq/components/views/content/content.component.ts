import { Component, input, signal } from '@angular/core';
import { Faq } from '@core/models/about-us.model';
import { AccordionBodyAdjusterDirective } from '@pages/faq/directives/accordion-body-adjuster.directive';

@Component({
  selector: 'app-content',
  imports: [ AccordionBodyAdjusterDirective ],
  template: `
    <div class="section-content py-16">
      <div class="limited-container">

        @if(!this.isLoading()){
          <div class="faqs flex flex-col gap-8 items-center">
            
            @for (faq of faqs(); track $index) {
              <div [attr.data-aos]="($index%2 == 0) ? 'fade-right' : 'fade-left'" [attr.data-aos-delay]="$index * 200" class="faq-container w-full max-w-[770px] overflow-hidden bg-[#FFECF0] rounded-lg">
                <button class="header flex justify-between p-7 gap-7 items-center cursor-pointer w-full" (click)="extends($index)">
                  <span class="text-(color:--secondary) !font-['Montserrat'] text-left text-base lg:text-lg font-bold leading-[120%] -tracking-[2%]">
                    {{ faq.question }}
                  </span>
                  <svg [class.rotate-180]="$index === this.extendedIndex()" class="duration-[.5s]" width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.54004 4.76001L7.92582 10.1458C8.70687 10.9268 9.9732 10.9268 10.7543 10.1458L16.14 4.76001" stroke="#020B26" stroke-linecap="round"/>
                  </svg>
                </button>
                <div class="body duration-[.3s] bg-white overflow-hidden" appAccordionBodyAdjuster [extend]="$index === this.extendedIndex()">
                  <p class="!font-['Montserrat'] m-7 text-(color:--secondary)/80 ">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            } @empty {
              <p class="">Sem informações para mostrar</p>
            }
  
          </div>
        } @else {
            <img class="w-9 h-9 mx-auto" src="assets/static/loader-primary.svg" alt="A carregar..." />
        }

      </div>
    </div>
  `,
  styles: ``
})
export class ContentComponent {
  extendedIndex = signal<number>(-1);
  faqs = input.required<Faq[]>();
  isLoading = input.required<boolean>();
  hasErrors = input.required<boolean>();

  extends(index: number): void{
    if(index === this.extendedIndex()){
      this.extendedIndex.set(-1);
      return;
    }
    this.extendedIndex.set(index);
  }

}
