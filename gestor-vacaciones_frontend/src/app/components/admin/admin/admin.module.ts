import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { AdminComponent } from './admin.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { DepartamentosComponent } from '../departamentos/departamentos.component';
import { TrabajadoresComponent } from '../trabajadores/trabajadores.component';
import { AgregarTrabajadorComponent } from '../agregar-trabajador/agregar-trabajador.component';
import { EditarTrabajadorComponent } from '../editar-trabajador/editar-trabajador.component';
import { SolicitudesComponent } from '../solicitudes/solicitudes.component';
import { VerSolicitudComponent } from '../ver-solicitud/ver-solicitud.component';
import { CalendarioComponent } from '../calendario/calendario.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { RouterModule, provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeComponent,
    AdminComponent,
    NavbarComponent,
    DepartamentosComponent,
    TrabajadoresComponent,
    AgregarTrabajadorComponent,
    EditarTrabajadorComponent,
    SolicitudesComponent,
    VerSolicitudComponent,
    CalendarioComponent,
  ],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule,
    ReactiveFormsModule,
  ]
})
export class AdminModule { }
