import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SuperadminComponent } from './superadmin/superadmin.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { AdministradoresComponent } from './administradores/administradores.component';
import { TrabajadoresComponent } from './trabajadores/trabajadores.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { AgregarTrabajadorComponent } from './agregar-trabajador/agregar-trabajador.component';
import { EditarTrabajadorComponent } from './editar-trabajador/editar-trabajador.component';
import { AgregarAdministradorComponent } from './agregar-administrador/agregar-administrador.component';
import { EditarAdministradorComponent } from './editar-administrador/editar-administrador.component';
import { VerSolicitudComponent } from './ver-solicitud/ver-solicitud.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { FullCalendarModule } from '@fullcalendar/angular';



@NgModule({
  declarations: [
    HomeComponent,
    SuperadminComponent,
    NavbarComponent,
    DepartamentosComponent,
    AdministradoresComponent,
    TrabajadoresComponent,
    SolicitudesComponent,
    AgregarTrabajadorComponent,
    EditarTrabajadorComponent,
    AgregarAdministradorComponent,
    EditarAdministradorComponent,
    VerSolicitudComponent,
    CalendarioComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FullCalendarModule,
  ]
})
export class SuperadminModule { }
