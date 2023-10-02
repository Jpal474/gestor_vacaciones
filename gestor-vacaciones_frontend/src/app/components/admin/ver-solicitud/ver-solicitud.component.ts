import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import {
  Solicitud,
  SolicitudEstado,
} from 'src/app/interfaces/solicitud.interface';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { RechazarSolicitud } from 'src/app/interfaces/rechazar_solicitud.interface';
import { AprobarSolicitud } from 'src/app/interfaces/aprobar_solicitud.interface';
import { SaldoActualizado } from 'src/app/interfaces/actualizar_saldo-vacacional.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
import { EmailObservacion } from 'src/app/interfaces/email_observacion.interface';
// Import pdfmake-wrapper and the fonts to use
import { Canvas, Img, Line, PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts"; // fonts provided for pdfmake
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
  saldo_vacacional: SaldoActualizado={
    dias_disponibles: 0,
    dias_tomados: 0,
  }
  email : EmailObservacion={
    destinatario: '',
    mensaje: '',
  }


  constructor(
    private adminService: AdminService,
    private activadedRoute: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit(): void {
    const params = this.activadedRoute.snapshot.params;
    if (params) {
      this.adminService.getSolicitudById(params['id']).subscribe({
        next: (res: Solicitud) => {
          this.solicitud = res;
          console.log(this.solicitud);
          this.getDias(this.solicitud.fecha_inicio, this.solicitud.fecha_fin);
          this.generarPDF();
          
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
      let correo = this.solicitud.empleado.id!;
      this.email = {
        destinatario: 'lovad28459@apxby.com',
        mensaje: text,
      };
      this.adminService.enviarMailObservaciones(this.email)
      .subscribe({
        next:(res: boolean)=> {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Las observaciones han sido enviadas',
            showConfirmButton: false,
            timer: 2000
          })
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
    else{
      console.log('sin texto');
      
    }
  }

  rechazarSolicitud(){
    let nombre_usuario = JSON.parse(atob(localStorage.getItem('usuario')!));
    if(nombre_usuario && this.solicitud.id)
    this.nombre_rechazar.nombre = nombre_usuario
    this.adminService.rechazarSolicitud(this.nombre_rechazar, this.solicitud.id!)
    .subscribe({
      next: (res: boolean)=> {
          if(res){
            this.adminService.enviarMailRechazada()
            .subscribe({
              next: (res: boolean)=>{
                if(res){
                  this.router.navigate([`/admin/home`]);
                }
              }
            })
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
    return this.adminService.aprobarSolicitud(this.nombre_aceptar, this.solicitud.id!)
    .subscribe({
      next: (res: boolean)=> {
          if(res){
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'La solicitud ha sido aprobada!',
            }),
            this.obtenerSaldoVacacional();
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


   actualizarSaldoVacacional(año: number){
    this.saldo_vacacional.dias_tomados += this.dias.length + this.dias2.length;
    console.log(this.saldo_vacacional.dias_tomados);
    this.saldo_vacacional.dias_disponibles = this.saldo_vacacional.dias_disponibles - (this.dias.length + this.dias2.length)
   console.log(this.saldo_vacacional.dias_disponibles);
    this.adminService.updateSaldoVacacional(this.solicitud.empleado.id!,año, this.saldo_vacacional)
    .subscribe({
      next: (res: SaldoVacacional)=> {
        if(res){
        this.adminService.enviarMailAprobada()
        .subscribe({
          next: (res: boolean)=> {
            if(res){
              this.router.navigate([`/admin/home`]);
            }
          }
        })
      }
      },
      error(err) {
        console.log(err);
        
      },
    })
  }

  obtenerSaldoVacacional(){
    const año = new Date().getFullYear()
    this.adminService.getSaldoByEmpleadoId(this.solicitud.empleado.id!,año)
    .subscribe({
      next: (res: SaldoVacacional)=> {
        if(res){
          this.saldo_vacacional.dias_disponibles = res.dias_disponibles;
          this.saldo_vacacional.dias_tomados = res.dias_tomados;
          this.actualizarSaldoVacacional(año);
        }
      }
    })
  }

  async generarPDF(){
    const fecha = moment(new Date(), 'YYYY-MM-DD');
    let dia = fecha.date()
    const mes = moment(fecha, 'YYYY-MM-DD').format('MMMM')
    const mes_español = this.traducirMes(mes);
    const año = fecha.year()
    const total_dias = this.dias.length + this.dias2.length;
    const mes1 = this.traducirMes(moment(this.solicitud.fecha_inicio, 'YYYY-MM-DD').format('MMMM'))
    const mes2 = this.traducirMes(moment(this.solicitud.fecha_fin, 'YYYY-MM-DD').format('MMMM'))

    const img = await new Img('../../../../assets/recursos/imagenes/general/logo_innmortal.png')
    .width(500)
    .height(100)
    .absolutePosition(40, -10)
    .build();
    const img2 = await new Img('../../../../assets/recursos/imagenes/general/footer_innmortal.png')
    .width(600)
    .height(100)
    .absolutePosition(0, -90)
    .build();
    
    
// If any issue using previous fonts import. you can try this:
// import pdfFonts from "pdfmake/build/vfs_fonts";

// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

const pdf = new PdfMakeWrapper();

pdf.info({
  title: `Solicitud Vacaciones ${this.solicitud.empleado.nombre} ${this.solicitud.empleado.apellidos}`,
  author: 'INNMORTAL',
})
pdf.pageMargins([ 40, 140, 40, 0 ]);
pdf.header(img);
pdf.add(  
new Txt(`Morelia, Michoacán ${dia} de ${mes_español} del año ${año}` ).bold().alignment("right").end,
);
pdf.add(
new Txt('Solicitud de Vacaciones').bold().alignment('left').margin([40, 40]).end,
)
pdf.add(
  new Txt('LCDE. Heriberto Padilla Ibarra, Director General').end
)
pdf.add(
  new Txt('M. en A. Iván Padilla Ibarra, Director de Operaciones \n\n\n').end
)
pdf.add(
  new Txt('Sirva la presente para saludarles y solicitarles la autorización de mis vacaciones.').alignment('justify').margin([0, 0, 0, 12]).end
)
pdf.add(
  new Txt([
    new Txt(`En la medida de lo posible dese disfrutar de un periodo vacacional correspondiente a `).end,
    new Txt(`${total_dias} días`).bold().end,
    new Txt(` comprendidos entre el `).end,
    new Txt(` ${moment(this.solicitud.fecha_inicio).date()} de ${mes1} del ${año}`).bold().end,
    ' al ',
    new Txt(`${moment(this.solicitud.fecha_fin).date()} de ${mes2} del ${año}.`).bold().end
  ]).alignment('justify').margin([0, 0, 0, 12]).end
)

pdf.add(
  new Txt('Por ello, me gustaría saber si es conveniente estas fechas al cronograma de actividades de la empresa.').alignment('justify').margin([0, 0, 0, 12]).end
)

pdf.add(
  new Txt('Esperando pronta y satisfactoria respuesta, sin más que agregar.').margin([0, 0, 0, 12]).alignment('justify').end
)

pdf.add(
  new Txt('Atentamente,').margin([0, 0, 0, 12]).margin(5).end
)

pdf.add(
  new Txt(`${this.solicitud.empleado.nombre} ${ this.solicitud.empleado.apellidos}`).margin(5).alignment('center').end
)

pdf.add(
  new Canvas([
    new Line([0, 100], [140, 100]).end,
  ]).end
  )

pdf.add(
  new Txt('Heriberto Padilla Ibarra \n').end
)

pdf.add(
  new Txt('Director General').end
)

pdf.add(
  new Canvas([
    new Line([310, -28], [450, -28]).end,
  ]).end
  )

pdf.add(
  new Txt('Iván Padilla Ibarra').absolutePosition(350, 585).end
)

pdf.add(
  new Txt('Director de Operaciones').absolutePosition(350, 600).end
  )

pdf.footer(img2)



pdf.create().open();
  }
}
