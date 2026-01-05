import { Pipe, PipeTransform } from '@angular/core';
import { convert, Unit as SizeUnit } from '@core/helpers/generic-converter.helper';
import { from } from 'rxjs';

@Pipe({
  name: 'sizeConverter'
})
export class SizeConverterPipe implements PipeTransform {

  transform(value: number, from: SizeUnit, to: SizeUnit): string {
    return convert(value, from, to);
  }

}
