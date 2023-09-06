import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { TrabajadorComponent } from './trabajador/trabajador.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';



@NgModule({
  declarations: [
    HomeComponent,
    TrabajadorComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class TrabajadoresModule { }
