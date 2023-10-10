import { Routes} from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { DepartamentosComponent } from '../departamentos/departamentos.component';
import { TrabajadoresComponent } from '../trabajadores/trabajadores.component';
import { AgregarTrabajadorComponent } from '../agregar-trabajador/agregar-trabajador.component';
import { EditarTrabajadorComponent } from '../editar-trabajador/editar-trabajador.component';
import { SolicitudesComponent } from '../solicitudes/solicitudes.component';
import { VerSolicitudComponent } from '../ver-solicitud/ver-solicitud.component';
import { CalendarioComponent } from '../calendario/calendario.component';
import { MisSolicitudesComponent } from '../mis-solicitudes/mis-solicitudes.component';
import { CrearSolicitudComponent } from '../crear-solicitud/crear-solicitud.component';
import { EditarSolicitudComponent } from '../editar-solicitud/editar-solicitud.component';
import { VerMisolicitudComponent } from '../ver-misolicitud/ver-misolicitud.component';
import { CuentaComponent } from '../cuenta/cuenta.component';



export const ADMIN_ROUTES: Routes = [
    { path: 'home', component:HomeComponent},
    {path: 'departamentos', component: DepartamentosComponent},
    {path: 'trabajadores', component: TrabajadoresComponent},
    {path: 'agregar_trabajador', component: AgregarTrabajadorComponent},
    {path: 'editar_trabajador/:id', component: EditarTrabajadorComponent},
    {path: 'solicitudes', component: SolicitudesComponent},
    {path: 'solicitud/:id', component: VerSolicitudComponent},
    {path: 'mis_solicitudes', component: MisSolicitudesComponent},
    {path: 'mi_solicitud/:id', component: VerMisolicitudComponent},
    {path: 'crear_solicitud', component: CrearSolicitudComponent},
    {path: 'editar_solicitud/:id', component: EditarSolicitudComponent},
    {path: 'calendario', component: CalendarioComponent},
    {path: 'cuenta', component: CuentaComponent},
    {path:'**', pathMatch:'full', redirectTo:'pagenotfound'},
    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];
