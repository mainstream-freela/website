import { Component, ElementRef, forwardRef, input, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true
    }
  ],
  templateUrl: './file-input.component.html',
  styles: ``
})
export class FileInputComponent implements ControlValueAccessor {
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  accept = input('.pdf');

  private onChange: (value: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  // Called by Angular to write model -> view
  writeValue(value: File | null): void {
    // IMPORTANT: nunca atribuir fileInput.nativeElement.value = value (pode ser File/null)
    // Apenas limpamos o input quando o valor é falsy
    if (!value) {
      this.fileInput()!.nativeElement.value = '';
    }
    // se houver um File no model, não tentamos colocá-lo no input (não é suportado)
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.fileInput()!.nativeElement.disabled = isDisabled;
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    this.onChange(file);
    this.onTouched();
  }

  // Utilitário público para limpar o input por fora
  public clear() {
    this.fileInput()!.nativeElement.value = '';
    this.onChange(null);
  }
}
