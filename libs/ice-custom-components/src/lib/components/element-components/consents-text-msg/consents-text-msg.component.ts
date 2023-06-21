import { Component, OnInit } from '@angular/core';
import { ElementComponentImplementation } from '@impeo/ng-ice';


@Component({
  selector: 'app-consents-text-msg',
  templateUrl: './consents-text-msg.component.html',
  styleUrls: ['./consents-text-msg.component.scss']
})
export class ConsentsTextMsgComponent extends ElementComponentImplementation implements OnInit {


  constructor() {
    super();
   }

  ngOnInit() {
  var x1=this.context.iceModel.elements['consent.number.contracts'].getValue().forIndex(null); 
  var x2=this.context.iceModel.elements['consent.number.submition'].getValue().forIndex(null); 
  var difference=x1-x2;

  if(difference>0){
    if(difference === 1) {
      this.value="Για το "+ difference+ " συμβόλαιο που δεν έχετε επιβεβαιώσει τη συγκατάθεσή σας,θα φροντίσουμε να σας το υπενθυμίσουμε την επόμενη φορά"
    }else{
      this.value="Για τα "+ difference+ " συμβόλαια που δεν έχετε επιβεβαιώσει τη συγκατάθεσή σας,θα φροντίσουμε να σας το υπενθυμίσουμε την επόμενη φορά"
    }
    }
  else {
    this.value="Ευχαριστούμε πολύ για τη συνεργασία!"
  }


  }

  getText()
  {
    return this.value;
  }

}
