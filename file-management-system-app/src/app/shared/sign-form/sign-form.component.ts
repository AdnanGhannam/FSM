import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'fms-sign-form',
  host: {
    "class": "sign-form"
  },
  templateUrl: './sign-form.component.html',
  styleUrls: ['./sign-form.component.scss']
})
export class SignFormComponent {
  @Input() title: string = "";
  @HostBinding('attr.title') get getTitle(): null {
    return null;
  }
  
  @Input() message: string = "";
  @Input() linkTo: string = "";
}
