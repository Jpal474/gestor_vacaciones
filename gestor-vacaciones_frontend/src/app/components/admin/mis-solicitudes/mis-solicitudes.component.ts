import { Component } from '@angular/core';
import { Empleado } from 'src/app/interfaces/empleados.interface';
import { SolicitudEmpleado } from 'src/app/interfaces/solicitud-empleado';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class MisSolicitudesComponent {

  solicitudes: SolicitudEmpleado[] = [] 

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    let id = JSON.parse(atob(localStorage.getItem('id')!));
    console.log(id);
    
    if (id){
      this.adminService.getEmpleadoByUserId(id)
      .subscribe({
        next: (res: Empleado)=> {
          if(res.id){
            console.log(res);
           this.adminService.getMisSolicitudes(res.id)
           .subscribe({
              next: (res: Solicitud[])=> {
                this.solicitudes = res;
              if(!(this.solicitudes)){
                Swal.fire({
                  icon: 'warning',
                  title: 'No Hay Solicitudes Por Mostrar',
                }) 

              }       
              }
           })       
          }
         }
      })
    } 
  }
}
