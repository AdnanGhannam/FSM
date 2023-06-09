import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiComponentsModule } from './ui-components/ui-components.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';
import { CanActivateSignForm } from './guards/CanActivateSignForm';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    UiComponentsModule,
    SharedModule,
    PagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
