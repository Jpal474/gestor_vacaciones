import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';



@NgModule({
  declarations: [
    HomeComponent,
    SuperadminComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SuperadminModule { }
