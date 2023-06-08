import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'fms-paginator[total][pageSize]',
  host: {
    "class": "paginator"
  },
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  static MAX_LENGTH = 7;
  @Input() total!: number;
  @Input() pageSize!: number;
  get length() {
    return Math.ceil(this.total / this.pageSize);
  }

  @Input() currentPage: number = 1;

  numbers: number[] = [];
  @Output() onValueChange = new EventEmitter<number>();

  ngOnInit() {
    this._onValueChange(this.currentPage);
  }

  private range(start: number, end: number) {
    return [...Array(end - start + 1).keys()].map(val => val + start);
  }

  _onValueChange(page: number) {
    if (page == 0) return;

    this.onValueChange.emit(page);
    this.currentPage = page;
    this.numbers = this.getNumbers(page);
  }

  getNumbers(page: number) {
    if (this.length <= PaginatorComponent.MAX_LENGTH) {
      return this.range(1, this.length);
    }

    var sideWidth = PaginatorComponent.MAX_LENGTH < 9 ? 1 : 2;
    var leftWidth = (PaginatorComponent.MAX_LENGTH - sideWidth * 2 - 3) >> 1;
    var rightWidth = (PaginatorComponent.MAX_LENGTH - sideWidth * 2 - 2) >> 1;

    if (page <= PaginatorComponent.MAX_LENGTH - sideWidth - 1 - rightWidth) {
      // no break on left of page
      return this.range(1, PaginatorComponent.MAX_LENGTH - sideWidth - 1)
        .concat([0])
        .concat(this.range(this.length - sideWidth + 1, this.length));
    }
    if (page >= this.length - sideWidth - 1 - rightWidth) {
        // no break on right of page
        return this.range(1, sideWidth)
            .concat([0])
            .concat(this.range(this.length - sideWidth - 1 - rightWidth - leftWidth, this.length));
    }

    // Breaks on both sides
    return this.range(1, sideWidth)
        .concat([0])
        .concat(this.range(page - leftWidth, page + rightWidth))
        .concat([0])
        .concat(this.range(this.length - sideWidth + 1, this.length));
  }
}
