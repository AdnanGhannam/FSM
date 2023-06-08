import { Component } from '@angular/core';

/**
<fms-menu>
    <button class="fms-button" button>Open menu</button>
    <a class="fms-link" cdkMenuItem>Settings</a>
    <a class="fms-link" cdkMenuItem>Help</a>
</fms-menu>
*/
@Component({
  selector: 'fms-menu',
  host: {
    "class": "menu"
  },
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

}
