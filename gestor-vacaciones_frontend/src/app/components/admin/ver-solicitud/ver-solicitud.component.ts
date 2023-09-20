import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { Solicitud, SolicitudEstado } from 'src/app/interfaces/solicitud.interface';

@Component({
  selector: 'app-ver-solicitud',
  templateUrl: './ver-solicitud.component.html',
  styleUrls: ['./ver-solicitud.component.css']
})
export class VerSolicitudComponent {
  solicitud: Solicitud = {
    fecha_inicio:'',
    fecha_fin: '',
    fecha_creacion: '',
    justificacion: '',
    estado:SolicitudEstado.PENDIENTE,
    empleado: {
      nombre: '',
      apellidos: '',
      genero: EmpleadoGenero.OTRO,
      fecha_contratacion: '',
      usuario: {
        nombre_usuario: '',
        correo:''
      },
      departamento:{
        nombre: '',
      }
    }
  }

  constructor(
    private activadedRoute: ActivatedRoute,
    private router: Router
  ) {
    
  }

}
