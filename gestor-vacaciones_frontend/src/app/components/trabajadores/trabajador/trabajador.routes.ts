import { Routes } from '@angular/router'
import { HomeComponent } from "../home/home.component";



export const TRABAJADOR_ROUTES: Routes = [
    { path: 'home', component:HomeComponent},
    {path:'**', pathMatch:'full', redirectTo:'pagenotfound'},
    //{ path: 'path/:routeParam', component: MyComponent },
    //{ path: 'staticPath', component: ... },
    //{ path: '**', component: ... },
    //{ path: 'oldPath', redirectTo: '/staticPath' },
    //{ path: ..., component: ..., data: { message: 'Custom' }
];
