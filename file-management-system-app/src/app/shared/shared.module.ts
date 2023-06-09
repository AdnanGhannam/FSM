import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignFormComponent } from './sign-form/sign-form.component';
import { UiComponentsModule } from '../ui-components/ui-components.module';
import { AppRoutingModule } from '../app-routing.module';
import { PlansComponent } from './plans/plans.component';



@NgModule({
  declarations: [
    SignFormComponent,
    PlansComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    UiComponentsModule
  ],
  exports: [
    SignFormComponent,
    PlansComponent
  ]
})
export class SharedModule { }
