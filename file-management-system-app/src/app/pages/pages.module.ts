import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { UiComponentsModule } from '../ui-components/ui-components.module';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { DialogModule } from '@angular/cdk/dialog';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    UiComponentsModule,
    DialogModule
  ],
  exports: [
    LoginComponent
  ]
})
export class PagesModule { }
