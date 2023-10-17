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
  paginas = 0;
  paginasArray: number[]=[];
  pagina_actual = 0;
  constructor(private superadService: SuperadService) {}

  ngOnInit(): void {
    this.getSolicitudes(1);
  }

  getSolicitudes(page:number){
    this.pagina_actual = page;
    this.superadService.getAllSolicitudes(5,page)
    .subscribe({
      next: (res:{ solicitudes: Solicitud[]; pages: number })=> {
        this.solicitudes=res.solicitudes;
        this.paginas = res.pages;
          this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);
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
