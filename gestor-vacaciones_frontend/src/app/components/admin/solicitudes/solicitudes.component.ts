import { Component, OnInit } from '@angular/core';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit{
  solicitudes: Solicitud[] = []

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getSolicitudes();
  }

  getSolicitudes(){
    this.adminService.getSolicitudesTrabajadores()
    .subscribe({
      next: (res: Solicitud[])=> {
        this.solicitudes = res;        
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
