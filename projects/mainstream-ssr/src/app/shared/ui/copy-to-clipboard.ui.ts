import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, inject, input, PLATFORM_ID, signal, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-copy-to-clipboard',
  imports: [NgTemplateOutlet],
  template: `
  @if(!hasCopied()){
    <ng-container *ngTemplateOutlet="buttonTemplateRef(); context: buttonContext"></ng-container>
  } @else {
    <ng-container *ngTemplateOutlet="messageTemplateRef() || defaultMessageTemplate"></ng-container>

    <ng-template #defaultMessageTemplate>
      Copiado!
    </ng-template>
  }
  `,
  styles: ``
})
export class CopyToClipboardUi {
  buttonTemplateRef = contentChild<TemplateRef<any>>('buttonTemplate');
  messageTemplateRef = contentChild<TemplateRef<any>>('messageTemplate');

  private platformId = inject(PLATFORM_ID);

  target = input.required<string>();
  resetingTimeout = input<number>(3000);
  
  hasCopied = signal<boolean>(false);

  get buttonContext() {
    return {
      copy: () => this.copyToClipboard()
    };
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.target());
    this.hasCopied.set(true);
    this.reset();
  }

  reset(): void {
    if(!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      this.hasCopied.set(false);
    }, this.resetingTimeout());
  }
}
