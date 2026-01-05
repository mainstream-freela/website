import { Component, input } from '@angular/core';
import { Event } from '@core/models/event.model';

@Component({
  selector: 'app-hero',
  imports: [],
  template: `
    <div class="section-content bg-[#FFECF0] py-10">
      <div class="limited-container flex flex-col gap-[50px] lg:flex-row lg:justify-between lg:items-center">
        @if (!this.isLoading()) {
          <div class="content w-full flex flex-col gap-7 text-(color:--secondary) lg:max-w-[509px]">
            <h1 data-aos="fade-right" data-aos-delay="0" class=" !font-[Unigeo] font-semibold text-[45px] xl:text-[3.5rem] xl-1920:text-6xl leading-[120%]">
              {{ this.event()[0].title }}
            </h1>
            <div data-aos="fade-right" data-aos-delay="200" class="details-box flex flex-col gap-7 p-7 rounded-lg border border-[#FFC3C3] lg:max-w-[374px]">
              <h1 class=" text-(color:--secondary) font-semibold text-lg leading-[120%] tracking-[-2%]">Detalhes do Evento</h1>
              <div class="details-content flex flex-col gap-3">
                  <div class="date flex gap-2 justify-start items-center">
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.9216 9.55979H18.52V8.59979C18.52 8.51492 18.4863 8.43352 18.4263 8.37351C18.3663 8.3135 18.2849 8.27979 18.2 8.27979C18.1152 8.27979 18.0338 8.3135 17.9738 8.37351C17.9137 8.43352 17.88 8.51492 17.88 8.59979V9.55979H12.12V8.59979C12.12 8.51492 12.0863 8.43352 12.0263 8.37351C11.9663 8.3135 11.8849 8.27979 11.8 8.27979C11.7152 8.27979 11.6338 8.3135 11.5738 8.37351C11.5137 8.43352 11.48 8.51492 11.48 8.59979V9.55979H10.0784C9.60146 9.55979 9.14403 9.74926 8.80677 10.0865C8.4695 10.4238 8.28003 10.8812 8.28003 11.3582V19.9214C8.28003 20.3984 8.4695 20.8558 8.80677 21.193C9.14403 21.5303 9.60146 21.7198 10.0784 21.7198H19.9216C20.3986 21.7198 20.856 21.5303 21.1933 21.193C21.5306 20.8558 21.72 20.3984 21.72 19.9214V11.3582C21.72 10.8812 21.5306 10.4238 21.1933 10.0865C20.856 9.74926 20.3986 9.55979 19.9216 9.55979ZM10.0784 10.1998H19.9216C20.2289 10.1998 20.5235 10.3218 20.7407 10.5391C20.958 10.7563 21.08 11.051 21.08 11.3582V12.1198H8.92003V11.3582C8.92003 11.051 9.04207 10.7563 9.25932 10.5391C9.47656 10.3218 9.7712 10.1998 10.0784 10.1998ZM19.9216 21.0798H10.0784C9.7712 21.0798 9.47656 20.9577 9.25932 20.7405C9.04207 20.5233 8.92003 20.2286 8.92003 19.9214V12.7598H21.08V19.9214C21.08 20.2286 20.958 20.5233 20.7407 20.7405C20.5235 20.9577 20.2289 21.0798 19.9216 21.0798Z" fill="#F20530"/>
                          <circle cx="15" cy="15" r="14.5" stroke="#FFC4C4"/>
                      </svg>
                      <p class="!font-['Montserrat'] leading-[120%] text-(color:--secondary) tracking-[-2%]">
                        {{ this.event()[0].formatted_date + ' às ' + this.event()[0].time  }}
                      </p>
                  </div>
                  <div class="location flex gap-2 justify-start items-center">
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="15" cy="15" r="14.5" stroke="#FFC4C4"/>
                          <path d="M15.0174 11.5498C13.7256 11.5498 12.6748 12.6008 12.6748 13.8925C12.6748 15.1842 13.7256 16.2351 15.0174 16.2351C16.3091 16.2351 17.3599 15.1842 17.3599 13.8925C17.3599 12.6008 16.3091 11.5498 15.0174 11.5498ZM15.0174 15.6726C14.0357 15.6726 13.2373 14.874 13.2373 13.8925C13.2373 12.9109 14.0357 12.1123 15.0174 12.1123C15.999 12.1123 16.7974 12.9109 16.7974 13.8925C16.7974 14.874 15.999 15.6726 15.0174 15.6726Z" fill="#F20530"/>
                          <path d="M15.0173 8.53125C12.0612 8.53125 9.65625 10.9362 9.65625 13.8923C9.65625 16.789 14.6169 21.3314 14.8281 21.5233C14.8819 21.572 14.9495 21.5965 15.0173 21.5965C15.0851 21.5965 15.1527 21.572 15.2065 21.5233C15.4178 21.3314 20.3784 16.789 20.3784 13.8923C20.3784 10.9362 17.9734 8.53125 15.0173 8.53125ZM15.0173 20.9301C14.106 20.0663 10.2188 16.2427 10.2188 13.8923C10.2188 11.2464 12.3712 9.09375 15.0173 9.09375C17.6634 9.09375 19.8159 11.2464 19.8159 13.8923C19.8159 16.2427 15.9286 20.0663 15.0173 20.9301Z" fill="#F20530"/>
                      </svg>                
                      <p class="!font-['Montserrat'] leading-[120%] text-(color:--secondary) tracking-[-2%]">
                        {{ this.event()[0].location.name }}
                      </p>
                  </div>
              </div>
            </div>
          </div>
          <div data-aos="fade-left" data-aos-delay="100" class="image lg:w-[446px] h-[420px] lg:h-[500px] rounded-4xl overflow-hidden">
              <img [src]="this.event()[0].image" class="w-full h-full object-cover object-center" alt="">
          </div>
        } @else {

          <div class="content w-full flex flex-col gap-7 lg:max-w-[509px]">
            <h1 class=" !font-[Unigeo] placeholder !relative text-transparent !w-fit font-semibold text-[45px] xl:text-[3.5rem] xl-1920:text-6xl leading-[120%]">
              Placeholder linha
            </h1>
            <h1 class=" !font-[Unigeo] placeholder !relative text-transparent !w-fit font-semibold text-[45px] xl:text-[3.5rem] xl-1920:text-6xl leading-[120%]">
              Para título, segunda
            </h1>
            <div class="details-box flex flex-col gap-7 p-7 rounded-lg border border-[#FFC3C3] lg:max-w-[374px]">
              <h1 class="  font-semibold text-lg leading-[120%] tracking-[-2%]">Detalhes do Evento</h1>
              <div class="details-content flex flex-col gap-3">
                  <div class="date flex gap-2 justify-start items-center">
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19.9216 9.55979H18.52V8.59979C18.52 8.51492 18.4863 8.43352 18.4263 8.37351C18.3663 8.3135 18.2849 8.27979 18.2 8.27979C18.1152 8.27979 18.0338 8.3135 17.9738 8.37351C17.9137 8.43352 17.88 8.51492 17.88 8.59979V9.55979H12.12V8.59979C12.12 8.51492 12.0863 8.43352 12.0263 8.37351C11.9663 8.3135 11.8849 8.27979 11.8 8.27979C11.7152 8.27979 11.6338 8.3135 11.5738 8.37351C11.5137 8.43352 11.48 8.51492 11.48 8.59979V9.55979H10.0784C9.60146 9.55979 9.14403 9.74926 8.80677 10.0865C8.4695 10.4238 8.28003 10.8812 8.28003 11.3582V19.9214C8.28003 20.3984 8.4695 20.8558 8.80677 21.193C9.14403 21.5303 9.60146 21.7198 10.0784 21.7198H19.9216C20.3986 21.7198 20.856 21.5303 21.1933 21.193C21.5306 20.8558 21.72 20.3984 21.72 19.9214V11.3582C21.72 10.8812 21.5306 10.4238 21.1933 10.0865C20.856 9.74926 20.3986 9.55979 19.9216 9.55979ZM10.0784 10.1998H19.9216C20.2289 10.1998 20.5235 10.3218 20.7407 10.5391C20.958 10.7563 21.08 11.051 21.08 11.3582V12.1198H8.92003V11.3582C8.92003 11.051 9.04207 10.7563 9.25932 10.5391C9.47656 10.3218 9.7712 10.1998 10.0784 10.1998ZM19.9216 21.0798H10.0784C9.7712 21.0798 9.47656 20.9577 9.25932 20.7405C9.04207 20.5233 8.92003 20.2286 8.92003 19.9214V12.7598H21.08V19.9214C21.08 20.2286 20.958 20.5233 20.7407 20.7405C20.5235 20.9577 20.2289 21.0798 19.9216 21.0798Z" fill="#F20530"/>
                          <circle cx="15" cy="15" r="14.5" stroke="#FFC4C4"/>
                      </svg>
                      <p class="!font-['Montserrat'] placeholder !relative text-transparent !w-fit leading-[120%] tracking-[-2%]">
                        Placeholder para a data
                      </p>
                  </div>
                  <div class="location flex gap-2 justify-start items-center">
                      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="15" cy="15" r="14.5" stroke="#FFC4C4"/>
                          <path d="M15.0174 11.5498C13.7256 11.5498 12.6748 12.6008 12.6748 13.8925C12.6748 15.1842 13.7256 16.2351 15.0174 16.2351C16.3091 16.2351 17.3599 15.1842 17.3599 13.8925C17.3599 12.6008 16.3091 11.5498 15.0174 11.5498ZM15.0174 15.6726C14.0357 15.6726 13.2373 14.874 13.2373 13.8925C13.2373 12.9109 14.0357 12.1123 15.0174 12.1123C15.999 12.1123 16.7974 12.9109 16.7974 13.8925C16.7974 14.874 15.999 15.6726 15.0174 15.6726Z" fill="#F20530"/>
                          <path d="M15.0173 8.53125C12.0612 8.53125 9.65625 10.9362 9.65625 13.8923C9.65625 16.789 14.6169 21.3314 14.8281 21.5233C14.8819 21.572 14.9495 21.5965 15.0173 21.5965C15.0851 21.5965 15.1527 21.572 15.2065 21.5233C15.4178 21.3314 20.3784 16.789 20.3784 13.8923C20.3784 10.9362 17.9734 8.53125 15.0173 8.53125ZM15.0173 20.9301C14.106 20.0663 10.2188 16.2427 10.2188 13.8923C10.2188 11.2464 12.3712 9.09375 15.0173 9.09375C17.6634 9.09375 19.8159 11.2464 19.8159 13.8923C19.8159 16.2427 15.9286 20.0663 15.0173 20.9301Z" fill="#F20530"/>
                      </svg>                
                      <p class="!font-['Montserrat'] placeholder !relative text-transparent !w-fit leading-[120%]tracking-[-2%]">
                        Placeholder para a localização
                      </p>
                  </div>
              </div>
            </div>
          </div>
          <div class="image relative lg:w-[446px] h-[420px] lg:h-[500px] rounded-4xl overflow-hidden">
            <div class="placeholder"></div>
          </div>

        }
      </div>
   </div>
  `,
  styles: ``
})
export class HeroComponent {
  
  isLoading = input.required<boolean>();
  event = input.required<Event[]>();

}
