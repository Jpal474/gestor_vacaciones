import { Component, OnInit } from '@angular/core';
import { Empleado, EmpleadoEstado } from 'src/app/interfaces/empleados.interface';
import { SuperadService } from 'src/app/services/superad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
})
export class EmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  paginas = 0;
  paginasArray: number[]=[];
  pagina_actual=0;
  constructor(private superadService: SuperadService) {}

  ngOnInit(): void {
    this.getEmpleados(1);
  }

  getEmpleados(pagina: number) {
    this.pagina_actual = pagina;
    this.superadService.getEmpleados(5,pagina).subscribe({
      next: (res: { empleados: Empleado[], pages:number}) => {
        if(res){
          this.empleados = res.empleados;
          this.paginas = res.pages;
          this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);
        }
      },
    });
  }


  eliminarEmpleado(id: string | undefined) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Los cambios no son reversibles",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#007a00',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (id) {
          this.superadService.deleteUsuario(id)
          .subscribe({
            next: (res)=> {
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'El Empleado ha sido borrado con éxito',
              }),
              setTimeout(function(){
                window.location.reload();
             }, 2000); //recargo la página después de 2 segundos
            },
            error: (err)=> {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se pudo eliminar al empleado, codigo de error ${err.code}`,
              }) 
            }
          })
      }
      }
    })  
}

cambiarEstado(id:string | undefined, estado: EmpleadoEstado | undefined){
  let opcion = 1
  if(estado === 'DE VACACIONES')
  opcion=2;

this.superadService.updateEmpleadoStatus(id!, opcion)
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
  }
})
}
}
