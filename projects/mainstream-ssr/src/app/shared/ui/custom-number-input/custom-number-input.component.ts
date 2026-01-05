import { Component, forwardRef, input, InputSignal } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormFieldComponent } from '@libraries/forms/BaseFormFieldComponent';

@Component({
  selector: 'app-custom-number-input',
  standalone: true,
  imports: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomNumberInputComponent),
    multi: true
  }],
  template: `
    <div class="input-container bg-transparent p-4 max-w-22 w-fit h-[56px] border border-[#FFC3C3] rounded-lg overflow-hidden flex gap-4 justify-between items-center">
      <input
        type="number"
        class="w-full h-full !font-['Montserrat'] bg-transparent focus:outline-none"
        (input)="onInput($event)"
        [value]="value"
        (blur)="markedAsTouched()"
        [disabled]="disabled"
        id="">
      <div class="controllers flex flex-col gap-2">
        <div class="up h-[17px]">
          <button class="cursor-pointer" (click)="increment()">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.6399 11.56L10.2541 6.17421C9.47306 5.39316 8.20673 5.39316 7.42568 6.17421L2.03989 11.56" stroke="#020B26" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="down h-[17px]">
          <button class="cursor-pointer" (click)="decrement()">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.04004 4.75999L7.42582 10.1458C8.20687 10.9268 9.4732 10.9268 10.2543 10.1458L15.64 4.75999" stroke="#020B26" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
  /* Chrome, Safari, Edge, Opera */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
  `
})
export class CustomNumberInputComponent extends BaseFormFieldComponent<number> {

  min: InputSignal<number> = input<number>(-Infinity);
  max: InputSignal<number> = input<number>(Infinity);

  increment(): void{
    if(this.value === this.max()) return;
    this.value++;
    this.onChange(this.value);
  }

  decrement(): void{
    if(this.value === this.min()) return;
    this.value--;
    this.onChange(this.value);
  }

  onInput(event: any): void{
    const value = +event.target.value;
    if(!isNaN(value)){
      this.value = value;
      this.onChange(this.value);
    }
  }

}
