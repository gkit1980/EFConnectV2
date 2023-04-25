import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ElementComponentImplementation } from "@impeo/ng-ice";
import { Observable } from "rxjs/Rx";



@Component({
  selector: "app-comment-input",
  templateUrl: "./comment-input.component.html",
  styleUrls: ["./comment-input.component.scss"]
})
export class CommentInputComponent extends ElementComponentImplementation {
  value: any;
  charLength: any = 0;
  @ViewChild('messageInput') messageInput: ElementRef;
  search: string;   // text to search

  constructor() { super(); }

  ngOnInit() {
    super.ngOnInit();

    Observable.fromEvent(this.messageInput.nativeElement, 'keyup')
      // get value
      .map((evt: any) => evt.target.value)
      // text length must be > 2 chars
      //.filter(res => res.length > 2)
      // emit after 1s of silence
      .debounceTime(1000)
      // emit only if data changes since the last emit       
      .distinctUntilChanged()
      // subscription
      .subscribe((text: string) => this.submit(text));



  }

  submit(text: string) {

    this.search = text;
    this.charLength = this.search.length;
    let area = document.getElementById("textarea");
    area.style.height = "1px";
    area.style.height = 15 + area.scrollHeight + "px";
    this.context.iceModel.elements["amendments.comment.value"].setSimpleValue(this.search);

  }


}
