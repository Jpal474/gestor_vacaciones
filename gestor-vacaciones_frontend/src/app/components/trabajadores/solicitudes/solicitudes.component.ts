import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/interfaces/empleados.interface';
import { SolicitudEmpleado } from 'src/app/interfaces/solicitud-empleado';
import { Solicitud, SolicitudEstado } from 'src/app/interfaces/solicitud.interface';
import { TrabajadoresService } from 'src/app/services/trabajadores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: SolicitudEmpleado[] = [] 

  constructor(private trabajadorService: TrabajadoresService) {}

  ngOnInit(): void {
    let id = JSON.parse(atob(localStorage.getItem('id')!));
    console.log(id);
    
    if (id){
      this.trabajadorService.getEmpleadoByUserId(id)
      .subscribe({
        next: (res: Empleado)=> {
          if(res.id){
            console.log(res);
           this.trabajadorService.getSolicitudes(res.id)
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
