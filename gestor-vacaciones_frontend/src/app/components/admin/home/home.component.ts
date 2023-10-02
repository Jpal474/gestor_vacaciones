import { Component } from '@angular/core';
import * as moment from 'moment';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  numero_solicitudes: Number = 0;
  vacaciones = false;
  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getSolicitudesPendientesTrabajadores()
    .subscribe({
      next: (res: Number)=> {
        this.numero_solicitudes=res;
        this.generarAlerta()
      }
    })
  }
  
  generarAlerta(){
    const fecha = moment(new Date()).format('YYYY-MM-DD').split('-')
    const dia = parseInt(fecha[2]);
    const mes = fecha[1];
    console.log('dia', dia);
    console.log('mes', mes);
    if(mes== '09' && (dia>= 29 && dia<=31))
    this.vacaciones = true
  }

}
