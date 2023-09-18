import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/interfaces/empleados.interface';
import { SuperadService } from 'src/app/services/superad.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  empleados:Empleado[] = [];
  admins: Empleado[] = [];
  trabajadores: Empleado[] = [];
   constructor(private superadService: SuperadService) {}

   ngOnInit(): void {
   this.getEmpleados();
   this.getTrabajadores();
    }

  getEmpleados(){
    this.superadService.getAdministradores()
    .subscribe({
      next: (res:Empleado[])=> {
        this.admins = res;
        console.log(this.admins);
        
      }
    })
  }

  getTrabajadores(){
    this.superadService.getTrabajador()
    .subscribe({
      next: (res:Empleado[])=> {
        this.trabajadores = res;
        this.empleados = [...this.admins, ...this.trabajadores]
        console.log('empleados', this.empleados);
        
      }
    })
  }

}
