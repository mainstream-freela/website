import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Inject, input, OnChanges, PLATFORM_ID, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appBodyHeightLimiter]'
})
export class BodyHeightLimiterDirective implements OnChanges {

  hasBodyToLimit = input.required<boolean>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(!isPlatformBrowser(this.platformId)) return;
    const bodyElement = document.querySelector("body") as HTMLElement;
    
    if(this.hasBodyToLimit()){
      this.limitBodyElement(bodyElement);
    } else {
      this.unlimitBodyElement(bodyElement);
    }
  }

  limitBodyElement(bodyElement: HTMLElement){
    bodyElement.style.overflow = 'hidden';
  }

  unlimitBodyElement(bodyElement: HTMLElement){
    bodyElement.style.overflow = 'auto';
  }

}
