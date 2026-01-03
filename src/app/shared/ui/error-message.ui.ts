import { Component } from '@angular/core';

@Component({
  selector: 'app-error-message',
  imports: [],
  template: `
    <div class="limited-container py-20">
      <p class="text-center">
        Não foi possível manter a comunicação com o servidor.
      </p>
    </div>
  `,
  styles: ``
})
export class ErrorMessageUi {

}
