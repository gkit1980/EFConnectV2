import { Pipe } from '@angular/core';

@Pipe({
    name: 'euroCurrencyFormat'
})
export class EuroCurrencyFormat {
    transform(value: string,
        currencySign: string = '€ ',
       ): string {
      
        if(value==null) return null;
        else if(value=="---")
        return value;
        else
        {
        let result = value+currencySign;
        return result;
        }
    }
}