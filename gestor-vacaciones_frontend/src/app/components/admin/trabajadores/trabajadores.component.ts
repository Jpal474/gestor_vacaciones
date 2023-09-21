import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/interfaces/empleados.interface';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.css']
})
export class TrabajadoresComponent implements OnInit{
  trabajadores: Empleado[] = [];

  constructor(private adminService: AdminService) {}

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

}
