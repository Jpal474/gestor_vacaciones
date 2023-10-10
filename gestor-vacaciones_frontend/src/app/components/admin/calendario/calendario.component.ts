import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionGridPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { DiasFeriados } from 'src/app/interfaces/dias_feriados.interface';
import { AdminService } from 'src/app/services/admin.service';
import { FestivosService } from 'src/app/services/festivos.service';
import * as moment from 'moment';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  dias: DiasFeriados[]=[]
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionGridPlugin],
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    events: [],
    eventClick: function(info) {
      alert('Event: ' + info.event.title);
      alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
      alert('View: ' + info.view.type);
    }
  };

  constructor(
    private adminService: AdminService,
    private feriadosService: FestivosService) {}

  ngOnInit(): void {
    let events:any;
    this.feriadosService.getDiasFeriados().
    subscribe({
      next: (res: DiasFeriados[]) => {
        if(res){
          this.dias = res
          console.log(this.dias);
          events = this.dias.map( event => ({title: event.name, date: event.date.toString().split(' ')[0]}));
          
        }
      },
      error: (err) => {
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
      },
      complete: () => {
        this.adminService.getSolicitudesAprobadas()
        .subscribe({
          next: (res: Solicitud[])=> {
            console.log(res);
            
           events = [
            ...events,
           ...res.map( event => ({title: `Vacaciones ${event.empleado.nombre}`, start: moment(event.fecha_inicio, '').format('YYYY-MM-DD'), end: moment( event.fecha_fin, 'YYYY-MM-DD').format('YYYY-MM-DD'), backgroundColor:'#378006'})),
            ]; 
            console.log(events);
            
          this.calendarOptions = {
            events: events
          }

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
          },
        })
      }
    })
    
  }
  }



