import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'placeHolder',
})
export class PlaceHolderPipe implements PipeTransform {

  transform(value: string, defecto: string = "Sin Titulo") {

    // if( value ) {
    //   return value;
    // } else {
    //   return defecto;
    // }
    // mas simple
    return ( value) ? value : defecto;

  }
}
