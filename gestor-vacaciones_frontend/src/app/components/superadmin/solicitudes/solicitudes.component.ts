import { Component, OnInit } from '@angular/core';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { SuperadService } from 'src/app/services/superad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = []

  constructor(private superadService: SuperadService) {}

  ngOnInit(): void {
    this.getSolicitudes();
  }

  getSolicitudes(){
    this.superadService.getSolicitudesAdmins()
    .subscribe({
      next: (res:Solicitud[])=> {
        this.solicitudes=res;
        this.superadService.getSolicitudesTrabajadores()
        .subscribe({
          next: (res: Solicitud[])=> {
            this.solicitudes.concat(res);
            console.log(this.solicitudes);
            
          },
          error: (err)=> {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: err,
            })  
           
          }
        })
        
      },
      error(err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err,
        })  
       
      },
    })

  }
}
