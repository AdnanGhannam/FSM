import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { API } from 'src/app/consts';
import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { PlansComponent } from 'src/app/shared/plans/plans.component';

@Component({
  selector: 'fms-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  errors: any[] = [];
  planId?: string;

  constructor(private http: HttpClient, 
              private dialog: Dialog,
              private router: Router){ }

  openDialog() {
    const dialogRef = this.dialog.open<string>(PlansComponent, {
      minWidth: '300px',
      data: this.planId
    });
    dialogRef.closed.subscribe(planId => this.planId = planId);
  }

  register({ form }: NgForm) {
    if (!this.planId) {
      this.errors = [{ message: "Please choose a plan" }];
      return;
    }

    if (form.valid) {
      const body = { 
        name: form.value.username, 
        email: form.value.email,
        password: form.value.password,
        planId: this.planId
      };

      this.http.post<any>(`${API}/register`, body)
        .subscribe({
          next: (_) => {
            this.router.navigateByUrl("/login");
          },
          error: ({ error }) => {
            this.errors = error.errors;
          }
        });
    }
  }
}
