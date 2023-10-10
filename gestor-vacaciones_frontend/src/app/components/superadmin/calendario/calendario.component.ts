import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionGridPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { SuperadService } from 'src/app/services/superad.service';
import { DiasFeriados } from 'src/app/interfaces/dias_feriados.interface';
import { FestivosService } from 'src/app/services/festivos.service';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import * as moment from 'moment';
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
      alert('Fecha: ' + info.event.start + ',' + info.jsEvent.pageY);
    }
  };

  constructor(
    private superadService: SuperadService,
    private festivosService: FestivosService) {}

  ngOnInit(): void {
    let events:any;
    const año = new Date().getFullYear()
    this.festivosService.getDiasFeriados().
    subscribe({
      next: (res: DiasFeriados[]) => {
        if(res){
          this.dias = res
          console.log(this.dias);
          events = this.dias.map( event => ({title: event.name, date: event.date.toString().split(' ')[0]}));
          
        }
      },
      error: (err) => {

      },
      complete: () => {
        this.superadService.getSolicitudesAprobadas()
        .subscribe({
          next: (res: Solicitud[])=> {
           events = [
            ...events,
           ...res.map( event => ({title: `Vacaciones ${event.empleado.nombre}`, start: moment(event.fecha_inicio, 'YYYY-MM-DD').format('YYYY-MM-DD'), end: moment( event.fecha_fin, 'YYYY-MM-DD').format('YYYY-MM-DD'), backgroundColor:'#378006'})),
            ]; 
            console.log(events);
            
          this.calendarOptions = {
            events: events
          }

          }
        })
      }
    })
    
  }

}
