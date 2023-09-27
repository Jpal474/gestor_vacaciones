import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionGridPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { TrabajadoresService } from 'src/app/services/trabajadores.service';
import { DiasFeriados } from 'src/app/interfaces/dias_feriados.interface';
import { Eventos } from 'src/app/interfaces/eventos.interface';
import { FestivosService } from 'src/app/services/festivos.service';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit{
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
    private trabajadorService: TrabajadoresService,
    private festivoService: FestivosService
    ) {}

  ngOnInit(): void {
    this.festivoService.getDiasFeriados().
    subscribe({
      next: (res: DiasFeriados[]) => {
        if(res){
          this.dias = res
          console.log(this.dias);
          const events = this.dias.map( event => ({title: event.name, date: event.date.toString().split(' ')[0]}));
          this.calendarOptions = {
            events: events
          }
          
        }
      },
      error(err) {
        console.log(err);
      },
      complete: () => {
        this.trabajadorService
      }
    })
    
  }

}
