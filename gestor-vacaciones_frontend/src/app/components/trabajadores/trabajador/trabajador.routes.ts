import { Routes } from '@angular/router'
import { HomeComponent } from "../home/home.component";
import { SolicitudesComponent } from '../solicitudes/solicitudes.component';
import { CrearSolicitudComponent } from '../crear-solicitud/crear-solicitud.component';
import { VerSolicitudComponent } from '../ver-solicitud/ver-solicitud.component';
import { CuentaComponent } from '../cuenta/cuenta.component';
import { EditarSolicitudComponent } from '../editar-solicitud/editar-solicitud.component';
import { CalendarioComponent } from '../calendario/calendario.component';



export const TRABAJADOR_ROUTES: Routes = [
    { path: 'home', component:HomeComponent},
    {path: 'solicitudes', component: SolicitudesComponent},
    {path: 'crear_solicitud', component: CrearSolicitudComponent},
    {path: 'solicitud', component: VerSolicitudComponent},
    {path: 'cuenta', component: CuentaComponent},
    {path: 'editar_solicitud/:id', component: EditarSolicitudComponent},
    {path: 'solicitud/:id', component: VerSolicitudComponent},
    {path: 'calendario', component: CalendarioComponent},
    {path:'**', pathMatch:'full', redirectTo:'pagenotfound'},
    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];
