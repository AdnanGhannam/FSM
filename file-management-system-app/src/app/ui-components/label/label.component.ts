import { Component, Input } from '@angular/core';

export type LabelType = 
"primary"
| "secondary"
| "success"
| "danger"
| "warning"
| "info"
| "light";

@Component({
  selector: '.fms-label',
  host: {
    "class": "label",
    "[style.--clr-label]": "'var(' + color + ')'"
  },
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent {
  @Input() type: LabelType = "primary";

  get color() {
    if (this.type == "primary") return "--blue";
    if (this.type == "secondary") return "--gray";
    if (this.type == "success") return "--green";
    if (this.type == "danger") return "--red";
    if (this.type == "warning") return "--yellow";
    if (this.type == "info") return "--light-blue";
    return "--white";
  }
}
