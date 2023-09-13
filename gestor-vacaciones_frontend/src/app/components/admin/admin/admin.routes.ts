import { Routes } from '@angular/router'
import { HomeComponent } from "../home/home.component";
import { DepartamentosComponent } from '../departamentos/departamentos.component';
import { TrabajadoresComponent } from '../trabajadores/trabajadores.component';
import { AgregarTrabajadorComponent } from '../agregar-trabajador/agregar-trabajador.component';



export const ADMIN_ROUTES: Routes = [
    { path: 'home', component:HomeComponent},
    {path: 'departamentos', component: DepartamentosComponent},
    {path: 'trabajadores', component: TrabajadoresComponent},
    {path: 'registrar_trabajador', component: AgregarTrabajadorComponent},
    {path:'**', pathMatch:'full', redirectTo:'pagenotfound'},
    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];
