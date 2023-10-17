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
  empleado_id='';
  paginas = 0;
  paginasArray: number[]=[];
  pagina_actual = 1;

  constructor(private trabajadorService: TrabajadoresService) {}

  ngOnInit(): void {
    let id = JSON.parse(atob(localStorage.getItem('id')!));
    console.log(id);
    
    if (id){
      this.trabajadorService.getEmpleadoByUserId(id)
      .subscribe({
        next: (res: Empleado)=> {
          if(res.id){
            this.empleado_id=res.id;
            console.log(res);
           this.trabajadorService.getSolicitudes(res.id, 5,1)
           .subscribe({
              next: (res: { solicitudes: Solicitud[]; pages: number })=> {
                this.solicitudes = res.solicitudes;
                this.paginas = res.pages;
                this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);  
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

  getSolicitudes(pagina:number){
    this.pagina_actual = pagina
    this.trabajadorService.getSolicitudes(this.empleado_id, 5,pagina)
           .subscribe({
              next: (res: { solicitudes: Solicitud[]; pages: number })=> {
                this.solicitudes = res.solicitudes;
                this.paginas = res.pages;
                this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);  
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
