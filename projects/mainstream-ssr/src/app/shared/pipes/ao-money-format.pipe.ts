import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'aoMoneyFormat'
})
export class AoMoneyFormatPipe implements PipeTransform {

  transform(value: number): string | undefined {
    let numberValue: number;
    numberValue = value;

    if (isNaN(numberValue)) return undefined;

    return numberValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

}
