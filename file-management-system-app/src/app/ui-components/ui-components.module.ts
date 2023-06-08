import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { LinkComponent } from './link/link.component';
import { AvatarComponent } from './avatar/avatar.component';
import {CdkMenuModule} from '@angular/cdk/menu';
import { MenuComponent } from './menu/menu.component';
import { ProgressComponent } from './progress/progress.component';
import { TreeViewComponent } from './tree-view/tree-view.component'; 
import { CdkTreeModule } from '@angular/cdk/tree';
import { LoaderComponent } from './loader/loader.component';
import { LabelComponent } from './label/label.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from './paginator/paginator.component';
import { TableComponent } from './table/table.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    LinkComponent,
    AvatarComponent,
    MenuComponent,
    ProgressComponent,
    TreeViewComponent,
    LoaderComponent,
    LabelComponent,
    ToolbarComponent,
    CheckboxComponent,
    PaginatorComponent,
    TableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CdkMenuModule,
    CdkTreeModule
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    LinkComponent,
    AvatarComponent,
    MenuComponent,
    ProgressComponent,
    TreeViewComponent,
    LoaderComponent,
    LabelComponent,
    ToolbarComponent,
    CheckboxComponent,
    PaginatorComponent,
    TableComponent
  ]
})
export class UiComponentsModule { }
