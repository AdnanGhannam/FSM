import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CanActivateSignForm } from './guards/CanActivateSignForm';

const routes: Routes = [
  { path: "login", component: LoginComponent, canActivate: [CanActivateSignForm] },
  { path: "register", component: RegisterComponent, canActivate: [CanActivateSignForm] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanActivateSignForm]
})
export class AppRoutingModule { }
