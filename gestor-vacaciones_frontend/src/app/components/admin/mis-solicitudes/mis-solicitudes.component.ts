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
  paginas = 0;
  paginasArray: number[]=[]; 
  empleado_id = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    let id = JSON.parse(atob(localStorage.getItem('id')!));
    console.log(id);
    
    if (id){
      this.adminService.getEmpleadoByUserId(id)
      .subscribe({
        next: (res: Empleado)=> {
          if(res.id){
            this.empleado_id = res.id;
            console.log(res);
           this.adminService.getMisSolicitudes(res.id, 5,1)
           .subscribe({
              next: (res: { solicitudes: Solicitud[]; pages: number })=> {
                this.solicitudes = res.solicitudes;
                this.paginas = res.pages;
                console.log(res);
                
                this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);
              if(this.solicitudes.length === 0){
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
    this.adminService.getMisSolicitudes(this.empleado_id, 5,pagina)
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
              },
              error: (err)=>{
                const cadena:string = 'unknown error'
          if(cadena.includes(err)){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha habido un error al completar la solicitud',
            })
          }
          else if('unauthorized'.includes(err)){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Debe iniciar sesión para completar la acción',
            })
          }
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err,
          })
        
          
              }
           })
  }
}
