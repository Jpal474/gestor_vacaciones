import { Component, OnInit } from '@angular/core';
import { Empleado, EmpleadoEstado } from 'src/app/interfaces/empleados.interface';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.css']
})
export class TrabajadoresComponent implements OnInit{
  trabajadores: Empleado[] = [];
  paginasArray: number[]=[];
  paginas = 0;

  constructor(
    private adminService: AdminService) {}

  ngOnInit(): void {
    this.getTrabajadores(1);
  }

  getTrabajadores(page: number) {
    this.adminService.getTrabajadores(5, page).subscribe({
      next: (res: { trabajadores: Empleado[]; pages: number }) => {
        this.trabajadores = res.trabajadores;  
        this.paginas = res.pages;  
        this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);
      },
    });
  }

  eliminarTrabajador(id: string | undefined){
    if(id){
    this.adminService.deleteUsuario(id)
    .subscribe({
      next: (res: boolean)=> {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El Trabajador ha sido eliminado con éxito',
        }),
        setTimeout(function(){
          window.location.reload();
       }, 2000);
      },
      error: (err)=> {
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
        }),
        setTimeout(function(){
          window.location.reload();
       }, 2000); 
      }
    })
  }
}

cambiarEstado(id:string | undefined, estado: EmpleadoEstado | undefined){
  let opcion = 1
  if(estado === 'DE VACACIONES')
  opcion=2;

this.adminService.updateEmpleadoStatus(id!, opcion)
.subscribe({
  next: (res: boolean)=> {
    if (res){
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'El Estado del Trabajador ha sido cambiado con éxito',
      }),
      setTimeout(function(){
        window.location.reload();
     }, 2000);
    }
  },
  error: (err)=> {
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
  },
})
}

}
