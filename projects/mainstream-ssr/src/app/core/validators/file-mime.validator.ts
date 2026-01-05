import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mimeTypeValidator(allowedTypes: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;

    if (!file) return null; // não validar se não houver arquivo

    // Para inputs do tipo file, o valor não está em control.value, mas em control._pendingValue
    const fileInput = control as any;
    
    const selectedFile = fileInput?._pendingValue as File | null;

    if (!selectedFile) return null;

    if (!allowedTypes.includes(selectedFile.type)) {
      return { invalidMimeType: true };
    }

    return null;
  };
}
