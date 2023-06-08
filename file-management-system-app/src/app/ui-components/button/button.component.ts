import { Component, Input } from '@angular/core';

@Component({
  selector: '.fms-button',
  host: {
    "class": "button",
    "[class.filled]": "filled"
  },
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() filled: boolean = false;
}
