import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import {
  Solicitud,
  SolicitudEstado,
} from 'src/app/interfaces/solicitud.interface';
import { SuperadService } from 'src/app/services/superad.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { RechazarSolicitud } from 'src/app/interfaces/rechazar_solicitud.interface';
import { AprobarSolicitud } from 'src/app/interfaces/aprobar_solicitud.interface';

@Component({
  selector: 'app-ver-solicitud',
  templateUrl: './ver-solicitud.component.html',
  styleUrls: ['./ver-solicitud.component.css'],
})
export class VerSolicitudComponent {
  dias: Number[] = [];
  dias2: Number[]=[];
  band: boolean=false;
  band_anio: boolean = false;
  nombre_rechazar:RechazarSolicitud = {
    nombre: '',
  }
  nombre_aceptar: AprobarSolicitud={
    nombre: '',
  }
  fechas={
    mes: '',
    mes2:'',
    anio: '',
    anio2:'',
  }
  solicitud: Solicitud = {
    id: 0,
    fecha_inicio: '',
    fecha_fin: '',
    fecha_creacion: '',
    estado: SolicitudEstado.PENDIENTE,
    justificacion: '',
    aprobada_por: '',
    denegada_por: '',
    empleado: {
      id: '',
      nombre: '',
      apellidos: '',
      genero: EmpleadoGenero.OTRO,
      fecha_contratacion: '',
      usuario: {
        nombre_usuario: '',
        correo: '',
      },
      departamento: {
        id: 0,
        nombre: '',
      },
    },
  };
  constructor(
    private superadService: SuperadService,
    private activadedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const params = this.activadedRoute.snapshot.params;
    if (params) {
      this.superadService.getSolicitudById(params['id']).subscribe({
        next: (res: Solicitud) => {
          this.solicitud = res;
          console.log(this.solicitud);
          this.getDias(this.solicitud.fecha_inicio, this.solicitud.fecha_fin);
          console.log('despues de dias');
          
        },
      });
    }
  }

  getDias(fecha_inicio: string, fecha_fin: string) { 
    console.log('---------');
       
    const fechaInicio = moment(fecha_inicio, 'YYYY-MM-DD');
    const fechaFinal = moment(fecha_fin, 'YYYY-MM-DD');
    console.log(fechaInicio, 'inicio');
    console.log(fechaFinal, 'final');
    const anio = fechaInicio.year();
    const anio2 = fechaFinal.year();
    
    
    let fecha_actual = fechaInicio.clone();
    let i= 0;
    while (fecha_actual.isSameOrBefore(fechaFinal, 'day')) {      
      // Verificar si el día actual no es sábado (6) ni domingo (0)
      console.log(i);
      if (fecha_actual.day() !== 6 && fecha_actual.day() !== 0) {
        
        if(i<0){
        this.dias.push(fecha_actual.date());
        console.log('entra al while');
        }
      else{
        if(fecha_actual.date() == 1){
          this.dias2.push(fecha_actual.date())
          this.band = true;
        }
        else if (!this.band) {
            this.dias.push(fecha_actual.date())
        }
        else{
          this.dias2.push(fecha_actual.date())
        }
      }
      }
      i+=1;
      // Avanzar al siguiente día
      console.log('salida de while');
      
      fecha_actual.add(1, 'day');
    }
    i=0;
    if(anio < anio2){ //si anio2 es mayor a anio, significa que habrá 2 nios
      this.band_anio= true;
      console.log(fechaInicio);
      console.log(fechaFinal);
      console.log('------');
    
       this.fechas.anio = anio.toString();
       this.fechas.anio2 = anio2.toString();
       const DATEMOMENT = moment(fechaInicio, 'YYYY-MM-DD').format('MMMM')
       const DATEMOMENT2 = moment(fechaFinal, 'YYYY-MM-DD').format('MMMM');
       console.log('traducir mes');
       
       this.fechas.mes = this.traducirMes(DATEMOMENT);
       this.fechas.mes2 = this.traducirMes(DATEMOMENT2);
    }
    else if (this.band){
      console.log('traducir mes2');
      this.fechas.anio = anio.toString()
      const DATEMOMENT = moment(fechaInicio, 'YYYY-MM-DD').format('MMMM')
      this.fechas.mes = this.traducirMes(DATEMOMENT);
      const DATEMOMENT2 = moment(fechaInicio, 'YYYY-MM-DD').format('MMMM')
      this.fechas.mes2 = this.traducirMes(DATEMOMENT2);
    }
    else{
      console.log('traducir mes3');
      this.fechas.anio = anio.toString();
      const DATEMOMENT = moment(fechaInicio, 'YYYY-MM-DD').format('MMMM')
      this.fechas.mes = this.traducirMes(DATEMOMENT);
    }
    console.log(this.fechas, 'fechas');
    console.log(this.dias, 'dias');
    console.log(this.dias2);
    
    
    
  }

  traducirMes(mes: string): string{
     let mes_español='';
    switch(mes){
      case 'January': 
      mes_español = 'Enero';
      break;
      case 'February': 
      mes_español = 'Febrero';
      break;
      case 'March':
        mes_español = 'Marzo';
        break;
      case 'April':
        mes_español = 'Abril';
        break;
      case 'May':
        mes_español = 'Mayo';
        break;
       case 'June':
        mes_español = 'Junio';
        break;
       case 'July':
        mes_español = 'Julio';
        break;
        case 'August':
          mes_español = 'Agosto';
          break;
        case 'September':
          mes_español = 'Septiembre';
          break;
        case 'October':
          mes_español = 'Octubre';
          break;
        case 'November':
          mes_español = 'Noviembre';
          break;
        case 'December':
          mes_español = 'Diciembre' ;
          break;
        default:
          console.log('Opcion No Reconocida');
          break;
          
    }
    return mes_español
  }

  async enviarMail() {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Message',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        'aria-label': 'Type your message here',
      },
      showCancelButton: true,
    });

    if (text) {
      Swal.fire(text);
    }
  }

  rechazarSolicitud(){
    let nombre_usuario = JSON.parse(atob(localStorage.getItem('usuario')!));
    if(nombre_usuario && this.solicitud.id)
    this.nombre_rechazar.nombre = nombre_usuario
    this.superadService.rechazarSolicitud(this.nombre_rechazar, this.solicitud.id!)
    .subscribe({
      next: (res: boolean)=> {
          if(res){
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'La solicitud ha sido rechaza!',
            })
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se ha podido rechazar la solicitud',
            }) 
          }
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

  aprobarSolicitud(){
    let nombre_usuario = JSON.parse(atob(localStorage.getItem('usuario')!));
    if(nombre_usuario && this.solicitud.id)
    this.nombre_aceptar.nombre = nombre_usuario
    return this.superadService.aprobarSolicitud(this.nombre_aceptar, this.solicitud.id!)
    .subscribe({
      next: (res: boolean)=> {
          if(res){
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'La solicitud ha sido aprobada!',
            })
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se ha podido aprobar la solicitud',
            }) 
          }
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
