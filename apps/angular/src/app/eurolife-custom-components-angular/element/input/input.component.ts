import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input('Label') label: string = 'test label';
  @Input('Placeholer') placeholder: string = 'test';
  @Input('Value') value: string = 'testing value default';
  @Input('Error') errorMsg: string = '';
  @Input('isPassword') isPassword: boolean = false;

  @Output() output : EventEmitter <string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  inputOnChange(){
    this.output.emit(this.value)
  }

}
