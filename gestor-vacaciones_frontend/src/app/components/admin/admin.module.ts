import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { TrabajadoresComponent } from './trabajadores/trabajadores.component';
import { AgregarTrabajadorComponent } from './agregar-trabajador/agregar-trabajador.component';



@NgModule({
  declarations: [
    HomeComponent,
    AdminComponent,
    NavbarComponent,
    DepartamentosComponent,
    TrabajadoresComponent,
    AgregarTrabajadorComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AdminModule { }
