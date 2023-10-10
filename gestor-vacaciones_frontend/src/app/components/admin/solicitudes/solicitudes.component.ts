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
  paginasArray: number[]=[];
  paginas = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getSolicitudes(1);
  }

  getSolicitudes(page:number){
    this.adminService.getSolicitudesTrabajadores(5,page)
    .subscribe({
      next: (res: { solicitudes: Solicitud[]; pages: number })=> {
        this.solicitudes = res.solicitudes;
        this.paginas = res.pages;  
        this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);        
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
      }
    })
  }

}
