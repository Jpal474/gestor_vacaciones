import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionGridPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { SuperadService } from 'src/app/services/superad.service';
import { DiasFeriados } from 'src/app/interfaces/dias_feriados.interface';
import { FestivosService } from 'src/app/services/festivos.service';
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
    private superadService: SuperadService,
    private festivosService: FestivosService) {}

  ngOnInit(): void {
    this.festivosService.getDiasFeriados().
    subscribe({
      next: (res: DiasFeriados[]) => {
        if(res){
          this.dias = res
          console.log(this.dias);
          const events = this.dias.map( event => ({title: event.name, date: event.date.toString().split(' ')[0]}));
          // this.dias.forEach(element => {
          //   const date = '2023-01-01'
          //   const dateTimeString = element.date;
          //   const datetime = new Date(dateTimeString);
          //   const dateString = datetime.toISOString().split('T')[0];
          //   console.log(dateString);
            
          // });
          events.push()
          // events = [ ...events, ...[{title: '', date: ''}]]
          this.calendarOptions = {
            events: events
          }
          
        }
      }
    })
    
  }

}
