import { PipeTransform, Pipe } from '@angular/core';


//
@Pipe({
    name: 'filterPipe'
})
export class FilterPipe implements PipeTransform {

    transform(value: any, input: any): any {
        let valName;
        if (input) {
           input= input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
           return value.filter((val: any ) => {
            valName = val.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            return valName.indexOf(input) >= 0});
         } else {
           return value;
         }
    }


}