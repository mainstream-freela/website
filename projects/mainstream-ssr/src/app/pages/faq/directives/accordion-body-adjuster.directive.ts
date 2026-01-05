import { Directive, ElementRef, inject, input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appAccordionBodyAdjuster]'
})
export class AccordionBodyAdjusterDirective implements OnChanges {

  private renderer2 = inject(Renderer2);
  private accordionElement: ElementRef<HTMLElement>= inject(ElementRef<HTMLElement>);
  extend = input.required<boolean>();
  uniqueChildDefualtMargin = input<number>(28); // div.body>p.m-7

  ngOnChanges(changes: SimpleChanges): void {
    this.toggleExtendBody();
  }

  toggleExtendBody(): void{
    
    const element = this.accordionElement.nativeElement.children[0] as HTMLElement | undefined;
    if (!element) return;

    if(this.extend()){
      this.renderer2.setStyle(this.accordionElement.nativeElement, 'height', `${ element.clientHeight + this.uniqueChildDefualtMargin() }px`);
      return;
    }
    this.renderer2.setStyle(this.accordionElement.nativeElement, 'height', `0px`);
  }

}
