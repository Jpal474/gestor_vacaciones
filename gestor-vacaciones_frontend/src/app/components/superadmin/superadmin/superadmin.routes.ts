import { DepartamentosComponent } from '../departamentos/departamentos.component';
import { HomeComponent } from '../home/home.component';
import { Routes } from '@angular/router'
import { SolicitudesComponent } from '../solicitudes/solicitudes.component';
import { VerSolicitudComponent } from '../ver-solicitud/ver-solicitud.component';
import { CalendarioComponent } from '../calendario/calendario.component';
import { EmpleadosComponent } from '../empleados/empleados.component';
import { AgregarEmpleadoComponent } from '../agregar-empleado/agregar-empleado.component';
import { EditarEmpleadoComponent } from '../editar-empleado/editar-empleado.component';


export const SUPERADMIN_ROUTES: Routes = [
    { path: 'home', component:HomeComponent},
    { path: 'departamentos', component:DepartamentosComponent},
    {path: 'empleados', component: EmpleadosComponent},
    {path: 'agregar_empleado', component: AgregarEmpleadoComponent},
    {path: 'editar_empleado', component: EditarEmpleadoComponent},
    {path: 'solicitudes', component: SolicitudesComponent },
    {path: 'solicitud', component: VerSolicitudComponent},
    {path: 'calendario', component: CalendarioComponent},
    {path:'**', pathMatch:'full', redirectTo:'pagenotfound'},
    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];
