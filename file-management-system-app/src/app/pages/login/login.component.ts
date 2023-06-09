import { HttpClient } from '@angular/common/http';
import { Component, OnInit, asNativeElements } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { API } from 'src/app/consts';

@Component({
  selector: 'fms-login',
  host: {
    "class": "login-form"
  },
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errors: any[] = [];
  redirected: boolean = false;

  constructor(private http: HttpClient, 
              private route: ActivatedRoute,
              private router: Router){ }
            
  ngOnInit(): void {
    this.redirected = this.route.snapshot.queryParamMap.get("redirected") == "true";
  }

  login({ form }: NgForm) {
    if (form.valid) {
      const body = { 
        name: form.value.username, 
        password: form.value.password 
      };
      this.http.post<any>(`${API}/login`, body)
        .subscribe({
          next: ({ data }) => {
            if (form.value.remember) localStorage.setItem("token", data.token);
            else sessionStorage.setItem("token", data.token);
            this.router.navigateByUrl("/");
          },
          error: ({ error }) => {
            this.errors = error.errors;
          }
        });
    }
  }
}
