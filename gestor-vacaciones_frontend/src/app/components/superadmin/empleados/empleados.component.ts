import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/interfaces/empleados.interface';
import { SuperadService } from 'src/app/services/superad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css'],
})
export class EmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  admins: Empleado[] = [];
  trabajadores: Empleado[] = [];
  constructor(private superadService: SuperadService) {}

  ngOnInit(): void {
    this.getEmpleados();
  }

  getEmpleados() {
    this.superadService.getAdministradores().subscribe({
      next: (res: Empleado[]) => {
        this.admins = res;
        console.log(this.admins);
        this.getTrabajadores();
      },
    });
  }

  getTrabajadores() {
    this.superadService.getTrabajador().subscribe({
      next: (res: Empleado[]) => {
        this.trabajadores = res;
        this.empleados = [...this.admins, ...this.trabajadores];
        console.log('empleados', this.empleados);
      },
    });
  }

  eliminarEmpleado(id: string | undefined) {
    if (id) {
      this.superadService.deleteUsuario(id)
      .subscribe({
        next: (res)=> {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El Administrador ha sido guardado con éxito',
          }) 
        },
        error: (err)=> {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err,
          }) 
        }
      })
  }
}
}
