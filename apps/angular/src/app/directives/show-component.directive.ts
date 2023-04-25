
import { Directive, TemplateRef,ViewContainerRef,Input  } from '@angular/core';
import { IceContextService } from "@impeo/ng-ice";
import { IndexedValue } from '@impeo/ice-core';

@Directive({
  selector: '[appShowComponent]'
})
export class ShowComponentDirective {
  private hasView = false;
  private showAmendments =false;

  constructor(private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private contextService: IceContextService
)
    { }

  @Input() set  appShowComponent(condition: boolean)
  {
    if( (await this.contextService.getContext("customerArea")).iceModel.elements["amendments.showAmendments"].getValue().forIndex(null)==condition)
    {
      this.vcr.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
    else
    {
      this.vcr.clear();
      this.hasView = false;
    }

    (await this.contextService.getContext("customerArea")).iceModel.elements["amendments.showAmendments"].$dataModelValueChange.subscribe((value: IndexedValue) => {
    if (value.element.getValue().forIndex(null) === condition)
    {

          this.vcr.createEmbeddedView(this.templateRef);
          this.hasView = true;
    }
      else
    {
      this.vcr.clear();
      this.hasView = false;
    }
    })
  }

}
