import { Directive, ElementRef, inject, input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { totalHeightFromNodeList } from '@core/helpers/total-height.helper';

@Directive({
  selector: '[appMotionedHeight]'
})
export class MotionedHeight implements OnInit, OnDestroy {

  private mutationObserver!: MutationObserver;
  RouterOutletable = input.required<boolean>();

  private renderer2 = inject(Renderer2);
  private callsCount = 0;

  constructor(private element: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    this.mutationObserver = new MutationObserver((mutations) => {
      const children = this.element.nativeElement.childNodes as NodeListOf<HTMLElement>;
      
      const totalHeight = totalHeightFromNodeList(children);
      
      this.renderer2.setStyle(this.element.nativeElement, 'height', `${ totalHeight }px`);
      this.callsCount++;
      
      // console.log(this.element.nativeElement.className, mutations, this.callsCount)
      if(this.RouterOutletable() && this.callsCount <= 2) return;
      this.renderer2.addClass(this.element.nativeElement, 'duration-[1s]');

    });

    this.mutationObserver.observe(this.element.nativeElement, {
      childList: true,
      subtree: true
    });
  }

  ngOnDestroy(): void {
    this.mutationObserver.disconnect();
    this.callsCount = 0;
  }

}
