import { Component, Input } from '@angular/core';

@Component({
  selector: 'fms-progress',
  host: {
    "class": "progress",
    "[class.big]": "big",
    "[style.--bg-progress-prec]": "'var(' + color + ')'"
  },
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent {
  @Input() precentage: number = 0;
  @Input() big: boolean = false;
  get degree() { return (this.precentage / 100) * 180 - 180; }
  get color() { 
    if (this.precentage < 50) return "--blue";
    if (this.precentage < 75) return "--yellow";
    return "--red";
  }
}
