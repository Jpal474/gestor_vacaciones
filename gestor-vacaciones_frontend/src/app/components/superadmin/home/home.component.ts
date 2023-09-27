import { Component, OnInit } from '@angular/core';
import { SuperadService } from 'src/app/services/superad.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  numero_solicitudes: Number = 0;
constructor(private superadService: SuperadService) {}

ngOnInit(): void {
  this.superadService.getNumeroSolicitudesAprobadas()
  .subscribe({
    next: (res: Number)=> {
      this.numero_solicitudes=res;
    }
  })
}
}
