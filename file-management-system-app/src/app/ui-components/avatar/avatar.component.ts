import { Component, Input } from '@angular/core';

@Component({
  selector: 'fms-avatar[letter]',
  host: {
    "class": "avatar",
    "[attr.data-letter]": "letter"
  },
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  _letter!: string;
  @Input() 
  get letter() {
    return this._letter;
  }
  set letter(val: string) {
    this._letter = val.toUpperCase();
  }
}
