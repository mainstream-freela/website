import { Component, inject, input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchTerm } from '@core/contracts/search-term.contract';
import { Category } from '@core/models/category.model';
import { Location } from '@core/models/location.model';
import { SearchTermCatcher } from '@pages/search-result/helpers/search-term-catcher.helper';

@Component({
  selector: 'app-search',
  imports: [
    ReactiveFormsModule, FormsModule
  ],
  template: `
    <div class="section-content py-16">
      <div class="limited-container flex flex-col gap-[50px]">
          <div class="content flex flex-col gap-12">
              <div class="title text-center flex flex-col gap-2">
                  <h6 data-aos="fade-up" class="text-base xl:text-xl !font-['Montserrat']">
                      Procure o evento
                  </h6>
                  <h1 data-aos="fade-up" data-aos-delay="200" class="font-semibold text-2xl xl:text-4xl !font-['Unigeo']">
                      Mais próximo de ti
                  </h1>
              </div>

              <div class="form-content" data-aos="fade-up" data-aos-delay="300">
                  <form (submit)="submit()" [formGroup]="searchFormGroup" class="flex flex-col flex-wrap xl:flex-nowrap xl:flex-row xl:justify-center gap-8 xl:items-center">
                      <div class="form bg-[#FFECF0] w-full rounded-xl p-3 xl:py-7 xl:px-8 flex flex-wrap xl:flex-nowrap gap-4 xl:justify-start xl:items-center">
                          <div class="category flex gap-2 items-center xl:pr-9 xl:py-2">
                              <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="15.5" cy="15.5" r="14.5" stroke="#FFC4C4"/>
                                  <path d="M15.5174 12.0496C14.2256 12.0496 13.1748 13.1006 13.1748 14.3923C13.1748 15.684 14.2256 16.7349 15.5174 16.7349C16.8091 16.7349 17.8599 15.684 17.8599 14.3923C17.8599 13.1006 16.8091 12.0496 15.5174 12.0496ZM15.5174 16.1724C14.5357 16.1724 13.7373 15.3738 13.7373 14.3923C13.7373 13.4107 14.5357 12.6121 15.5174 12.6121C16.499 12.6121 17.2974 13.4107 17.2974 14.3923C17.2974 15.3738 16.499 16.1724 15.5174 16.1724Z" fill="#F20530"/>
                                  <path d="M15.5173 9.03125C12.5612 9.03125 10.1562 11.4362 10.1562 14.3923C10.1562 17.289 15.1169 21.8314 15.3281 22.0233C15.3819 22.072 15.4495 22.0965 15.5173 22.0965C15.5851 22.0965 15.6527 22.072 15.7065 22.0233C15.9178 21.8314 20.8784 17.289 20.8784 14.3923C20.8784 11.4362 18.4734 9.03125 15.5173 9.03125ZM15.5173 21.4301C14.606 20.5663 10.7188 16.7427 10.7188 14.3923C10.7188 11.7464 12.8712 9.59375 15.5173 9.59375C18.1634 9.59375 20.3159 11.7464 20.3159 14.3923C20.3159 16.7427 16.4286 20.5663 15.5173 21.4301Z" fill="#F20530"/>
                              </svg>
                              <select [(ngModel)]="category" [ngModelOptions]="{ standalone: true }" class="border-none max-w-20 focus:outline-none cursor-pointer !font-['Montserrat'] min-w-[120px] xl:min-w-[150px]" name="" id="">
                                  <option selected disabled [ngValue]=null>Categoria</option>
                                  @for (category of categories(); track $index) {
                                      <option [ngValue]="category.slug">{{ category.name }}</option>
                                  }
                              </select>
                          </div>
                          <div class="date xl:border-x border-[#FFC3C3] flex gap-2 items-center xl:px-9 xl:py-2">
                              <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20.4214 10.06H19.0198V9.1C19.0198 9.01513 18.9861 8.93374 18.9261 8.87372C18.866 8.81371 18.7847 8.78 18.6998 8.78C18.6149 8.78 18.5335 8.81371 18.4735 8.87372C18.4135 8.93374 18.3798 9.01513 18.3798 9.1V10.06H12.6198V9.1C12.6198 9.01513 12.5861 8.93374 12.5261 8.87372C12.466 8.81371 12.3847 8.78 12.2998 8.78C12.2149 8.78 12.1335 8.81371 12.0735 8.87372C12.0135 8.93374 11.9798 9.01513 11.9798 9.1V10.06H10.5782C10.1012 10.06 9.64379 10.2495 9.30652 10.5867C8.96926 10.924 8.77979 11.3814 8.77979 11.8584V20.4216C8.77979 20.8986 8.96926 21.356 9.30652 21.6933C9.64379 22.0305 10.1012 22.22 10.5782 22.22H20.4214C20.8984 22.22 21.3558 22.0305 21.693 21.6933C22.0303 21.356 22.2198 20.8986 22.2198 20.4216V11.8584C22.2198 11.3814 22.0303 10.924 21.693 10.5867C21.3558 10.2495 20.8984 10.06 20.4214 10.06ZM10.5782 10.7H20.4214C20.7286 10.7 21.0233 10.822 21.2405 11.0393C21.4577 11.2565 21.5798 11.5512 21.5798 11.8584V12.62H9.41979V11.8584C9.41979 11.5512 9.54183 11.2565 9.75907 11.0393C9.97631 10.822 10.271 10.7 10.5782 10.7ZM20.4214 21.58H10.5782C10.271 21.58 9.97631 21.458 9.75907 21.2407C9.54183 21.0235 9.41979 20.7288 9.41979 20.4216V13.26H21.5798V20.4216C21.5798 20.7288 21.4577 21.0235 21.2405 21.2407C21.0233 21.458 20.7286 21.58 20.4214 21.58Z" fill="#F20530"/>
                                  <circle cx="15.5" cy="15.5" r="14.5" stroke="#FFC4C4"/>
                              </svg>
                              <input type="date" formControlName="date" [min]="todayString" class="border-none focus:outline-none cursor-pointer !font-['Montserrat'] w-[110px] xl:min-w-[150px]" name="" id="">
                          </div>
                          <div class="location flex gap-2 justify-center pt-2 border-t xl:border-none border-[#FFC3C3] items-center w-full xl:w-auto xl:pl-9 xl:py-2">
                              <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="15.5" cy="15.5" r="14.5" stroke="#FFC4C4"/>
                                  <path d="M15.5174 12.0496C14.2256 12.0496 13.1748 13.1006 13.1748 14.3923C13.1748 15.684 14.2256 16.7349 15.5174 16.7349C16.8091 16.7349 17.8599 15.684 17.8599 14.3923C17.8599 13.1006 16.8091 12.0496 15.5174 12.0496ZM15.5174 16.1724C14.5357 16.1724 13.7373 15.3738 13.7373 14.3923C13.7373 13.4107 14.5357 12.6121 15.5174 12.6121C16.499 12.6121 17.2974 13.4107 17.2974 14.3923C17.2974 15.3738 16.499 16.1724 15.5174 16.1724Z" fill="#F20530"/>
                                  <path d="M15.5173 9.03125C12.5612 9.03125 10.1562 11.4362 10.1562 14.3923C10.1562 17.289 15.1169 21.8314 15.3281 22.0233C15.3819 22.072 15.4495 22.0965 15.5173 22.0965C15.5851 22.0965 15.6527 22.072 15.7065 22.0233C15.9178 21.8314 20.8784 17.289 20.8784 14.3923C20.8784 11.4362 18.4734 9.03125 15.5173 9.03125ZM15.5173 21.4301C14.606 20.5663 10.7188 16.7427 10.7188 14.3923C10.7188 11.7464 12.8712 9.59375 15.5173 9.59375C18.1634 9.59375 20.3159 11.7464 20.3159 14.3923C20.3159 16.7427 16.4286 20.5663 15.5173 21.4301Z" fill="#F20530"/>
                              </svg>
                              <select [(ngModel)]="location" [ngModelOptions]="{ standalone: true }" class="border-none max-w-20 focus:outline-none cursor-pointer !font-['Montserrat'] min-w-[120px] xl:min-w-[150px]" name="" id="">
                                  <option selected disabled [ngValue]=null>Localização</option>
                                  @for (location of locations(); track $index) {
                                      <option [ngValue]="location.slug">{{ location.name }}</option>
                                  }
                              </select>
                          </div>
                      </div>
                      <div class="submition">
                          <button type="submit" class="duration-[.3s] text-white hover:text-(color:--primary) bg-(color:--primary) hover:bg-white hover:border-1 hover:border-(color:--primary) w-full xl:w-[263px] cursor-pointer font-medium rounded-lg !font-['Montserrat'] text-sm px-7 py-6">
                              Pesquisar
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  </div>
  `,
  styles: ``
})
export class SearchComponent implements OnInit {

    searchFormGroup!: FormGroup;
    todayString = new Date().toISOString().split('T')[0]
    category: string | null = null;
    location: string | null = null;

    categories = input<Category[]>([]);
    locations = input<Location[]>([]);

    searchTermHelper = inject(SearchTermCatcher);
    router = inject(Router);
    
    ngOnInit(): void {
        this.searchFormGroup = new FormGroup({
            date: new FormControl('', [this.minDateValidator()])
            // q: new FormControl('')
        });
    }
    
    private minDateValidator(minDate: Date = new Date()) {
        return (control: AbstractControl): ValidationErrors | null => {
            const inputDate = new Date(control.value);

            // Zera a hora para comparar apenas as datas
            minDate.setHours(0, 0, 0, 0);
            inputDate.setHours(0, 0, 0, 0);

            return inputDate >= minDate ? null : { minDate: true };
        };
    }

    private getSearchTerm(): SearchTerm {
        const raw = this.searchFormGroup.value;
        const term: SearchTerm = {};

        // console.log(this.category, this.location)

        if (this.category && this.category !== 'Categoria') {
            term.category = this.category;
        }

        if (this.location && this.location !== 'Localização') {
            term.location = this.location;
        }

        if (raw.date) {
            term.date = raw.date;
        }

        // Se quiser incluir uma busca textual futuramente
        // if (raw.q?.trim()) {
        //   term.q = raw.q.trim();
        // }

        return term;
    }

    submit(): void{
        let searchTerm: SearchTerm = this.getSearchTerm();
        this.searchTermHelper.terms.set(searchTerm);

        this.router.navigate([ '/events/search-results' ]);
    }
}
