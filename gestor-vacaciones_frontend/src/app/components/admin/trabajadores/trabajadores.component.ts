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
  pagina_actual =0;

  constructor(
    private adminService: AdminService) {}

  ngOnInit(): void {
    this.getTrabajadores(1);
  }

  getTrabajadores(page: number) {
    this.pagina_actual = page
    this.adminService.getTrabajadores(5, page).subscribe({
      next: (res: { trabajadores: Empleado[]; pages: number }) => {
        this.trabajadores = res.trabajadores;  
        this.paginas = res.pages;  
        this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);
      },
      error: (err)=>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha habido un error al procesar la solicitud',
          confirmButtonColor:'#198754'
        }),
        console.log(err);
        
      }
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
          confirmButtonColor: ''
        }),
        setTimeout(function(){
          window.location.reload();
       }, 2000);
      },
      error: (err)=> {
        const cadena:string = 'Unknown Error'
        if(err.includes(cadena)){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha habido un error al completar la solicitud',
            confirmButtonColor:'#198754'
          })
        }
        else if('unauthorized'.includes(err)){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe iniciar sesión para completar la acción',
            confirmButtonColor:'#198754'
          })
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha habido un error al eliminar al trabajador',
          confirmButtonColor:'#198754'
        }),
        console.log(err);
        
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
        confirmButtonColor: ''
      }),
      setTimeout(function(){
        window.location.reload();
     }, 2000);
    }
  },
  error: (err)=> {
    const cadena:string = 'Unknown Error'
          if(err.includes(cadena)){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha habido un error al completar la solicitud',
              confirmButtonColor: ''
            })
          }
          else if(err.includes('Unauthorized')){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Debe iniciar sesión para completar la acción',
              confirmButtonColor:'#198754',
            })
          }
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al cambiar el estado',
            confirmButtonColor:'#198754',
          })
          console.log(err);
          
  },
})
}

}
