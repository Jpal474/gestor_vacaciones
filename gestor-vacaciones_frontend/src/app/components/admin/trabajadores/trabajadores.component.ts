import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/interfaces/empleados.interface';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.css']
})
export class TrabajadoresComponent implements OnInit{
  trabajadores: Empleado[] = [];

  constructor(
    private adminService: AdminService) {}

  ngOnInit(): void {
    this.getTrabajadores();
  }

  getTrabajadores() {
    this.adminService.getTrabajadores().subscribe({
      next: (res: Empleado[]) => {
        this.trabajadores = res;        
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

}
