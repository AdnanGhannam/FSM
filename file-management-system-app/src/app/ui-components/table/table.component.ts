import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'fms-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  tableId = crypto.randomUUID();
  lastSort: "asc" | "desc" = "desc";
  mockTableData: any[];

  constructor(private elementRef: ElementRef) {
    this.mockTableData = [
      { name: "File 1", date: new Date(2001, 2, 2), label: "Public" },
      { name: "File 2", date: new Date(2010), label: "Private" },
      { name: "File 3", date: new Date(), label: "Custom" },
      { name: "File 4", date: new Date(), label: "Private" },
      { name: "File 5", date: new Date(), label: "Public" },
      { name: "File 6", date: new Date(), label: "Public" },
      { name: "File 7", date: new Date(), label: "Custom" },
    ]
  }

  sortData(key: string) {
    this.mockTableData = this.mockTableData.sort((a, b) => {
      const [first, second] = 
        this.lastSort == "asc" 
        ? [a[key].toString(), b[key].toString()]
        : [b[key].toString(), a[key].toString()];
      return first.localeCompare(second, 'en', { sensitivity: 'base' })
    });

    this.lastSort = this.lastSort == "asc" ? "desc": 'asc';
  }

  getKeys() {
    if (this.mockTableData.length > 0) {
      return Object.keys(this.mockTableData[0]);
    }

    return [];
  }

  selectAll(e: Event) {
    const checks = (<HTMLElement>this.elementRef.nativeElement).querySelectorAll(".table__checkbox input");

    for (let i = 0; i < checks.length; i++) {
      (<HTMLInputElement>checks[i]).checked = (<HTMLInputElement>e.target).checked;
    }
  }
}
