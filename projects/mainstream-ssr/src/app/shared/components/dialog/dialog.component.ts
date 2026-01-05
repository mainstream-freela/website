import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, inject, input, OnChanges, output, PLATFORM_ID, signal, SimpleChanges, TemplateRef } from '@angular/core';
import { BodyHeightLimiterDirective } from '@shared/directives/body-height-limiter.directive';

@Component({
  selector: 'ducki-dialog',
  imports: [NgTemplateOutlet, NgClass, BodyHeightLimiterDirective],
  template: `
  
    <ng-container *ngTemplateOutlet="invokerElement(); context: invokerTemplateContext"></ng-container>

    <section class="dialog" appBodyHeightLimiter [hasBodyToLimit]="this.visible()">
      <div class="dialog-overlay fixed top-0 left-0 w-full h-full bg-black/62 z-[110]"
      [ngClass]="{
        'hidden': !this.visible() && this.firstTime(),
        'disappear': (!this.visible() && !this.firstTime()),
        'appear': this.visible()
      }"
      (click)="onOutsideClick()"
      ></div>
      <div
      [ngClass]="{
        'hidden': !this.visible() && this.firstTime(),
        'zoom-out': (!this.visible() && !this.firstTime()),
        'zoom-in': this.visible
      }"
      class="q-panel fixed bg-white rounded-2xl overflow-hidden z-[111] w-full left-[50%] top-[50%] flex justify-center items-center -translate-[50%] max-w-[325px] md:max-w-[620px]"
      >
         <ng-container *ngTemplateOutlet="panelTemplate(); context: panelTemplateContext"></ng-container>
      </div>
    </section>
  `,
  styles: `
    .dialog-overlay.appear{
      animation: appear .4s forwards ease-in-out;
    }
    .dialog-overlay.disappear{
        animation: disappear .7s forwards ease-in-out;
    }

    .q-panel.zoom-in{
      animation: zoomIn .4s forwards ease-in-out;
    }
    .q-panel.zoom-out{
        animation: zoomOut .7s forwards ease-in-out;
    }

    @keyframes appear {
        from{
            opacity: 0;
        }
        to{
            opacity: 1;
            display: block;
        }
    }

    @keyframes disappear {
        /* from{
            opacity: 0;
        } */
        50%{
            opacity: 0;
        }
        to{
            opacity: 0;
            display: none;
            z-index: -1 !important;
            position: relative;
        }
    }

    @keyframes zoomIn {
        from{
            opacity: 0;
            transform: scale(0.5);
        }
        to{
            opacity: 1;
            transform: scale(1);
            display: flex;
        }
    }

    @keyframes zoomOut {
        /* from{
            opacity: 0;
        } */
        50%{
            opacity: 0;
            transform: scale(0.5);
        }
        to{
            opacity: 0;
            transform: scale(0.5);
            display: none;
            z-index: -1 !important;
            position: fixed;
        }
    }
  `
})
export class DialogComponent implements OnChanges {

  confirm = output<boolean>();
  cancel = output<boolean>();
  closed = output<boolean>();

  closeOnOutsideClick = input<boolean>(false);
  platformId = inject(PLATFORM_ID);

  visible = signal<boolean>(false);
  firstTime = signal(true);

  openTrigger = input<boolean>(false);

  panelTemplate = contentChild<TemplateRef<any>>("panel");
  invokerElement = contentChild<TemplateRef<any>>('invoker');

  ngOnChanges(changes: SimpleChanges): void {
    if(this.openTrigger()){
      this.open();
    }
  }

  onOutsideClick(): void{
    if(!this.closeOnOutsideClick()) return;
    this.close();
  }
  
  open(): void{
    this.visible.set(true);
    this.firstTime.set(false);
  }

  close(): void{
    this.visible.set(false);
    this.closed.emit(true);
  }

  onConfirm(): void{
    this.close();
    this.confirm.emit(true);
  }

  onCancel(): void{
    this.close();
    this.cancel.emit(true);
  }

  get panelTemplateContext() {
    return {
      $implicit: {},
      close: () => this.close(),
      onConfirm: () => this.onConfirm(),
      onCancel: () => this.onCancel()
    }
  }

  get invokerTemplateContext() {
    return {
      $implicit: {},
      open: () => this.open(),
    }
  }

}
