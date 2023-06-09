import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { API } from 'src/app/consts';

type Plan = {
  _id: string;
  name: string;
  duration: number;
  storage: number;
  cost: number;
  numberOfMemebers: number;
  level: number;
};

@Component({
  selector: 'fms-plans',
  host: {
    "class": "plans"
  },
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  plans: Plan[] = [];
  currentActive = "";

  constructor(@Inject(DIALOG_DATA) private data: string,
              public dialogRef: DialogRef, 
              private http: HttpClient) {}

  ngOnInit() {
    this.currentActive = this.data;

    this.http.get<any>(`${API}/plans`)
      .subscribe(plans => {
        this.plans = plans.data
      });
  }
  
  onChange(id: string) {
    this.currentActive = id;
  }
}
