import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';



@NgModule({
  declarations: [
    HomeComponent,
    AdminComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AdminModule { }
