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
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import * as moment from 'moment';
import { Empleado } from 'src/app/interfaces/empleados.interface';


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
      alert(info.event.title);
    }
  };

  constructor(
    private trabajadorService: TrabajadoresService,
    private festivoService: FestivosService
    ) {}

  ngOnInit(): void {
    let events:any;
    this.festivoService.getDiasFeriados().
    subscribe({
      next: (res: DiasFeriados[]) => {
        if(res){
          this.dias = res
          console.log(this.dias);
          events = this.dias.map(event => {
            let color;
            if (event.type === 'public') {
              color = '#007ad9'; // Set the color for events of Type1
            } else if (event.type === 'bank') {
              color = '#330036'; // Set the color for events of Type2
            } else if (event.type === 'observance') {
              color = '#2F4858'; // Set the color for events of Type3
            } 
            return {
              title: event.name,
              date: event.date.toString().split(' ')[0],
              backgroundColor: color,
            };
          });
        }
      },
      error(err) {
        console.log(err);
      },
      complete: () => {
        const id_trabajador = JSON.parse(atob(localStorage.getItem('id')!))
        if(id_trabajador)
        this.trabajadorService.getEmpleadoByUserId(id_trabajador)
      .subscribe({
        next: (res: Empleado)=> {
          this.trabajadorService.getSolicitudesAprobadasByEmpleadoId(res.id!)
          .subscribe({
            next: (res: Solicitud[])=>{
              console.log(res);
              
              events = [
                ...events,
               ...res.map( event => ({title: `Vacaciones ${event.empleado.nombre}`, start: moment(event.fecha_inicio, 'YYYY-MM-DD').format('YYYY-MM-DD'), end: moment( event.fecha_fin, 'YYYY-MM-DD').format('YYYY-MM-DD'), backgroundColor:'#378006'})),
                ]; 
                console.log(events);
                
              this.calendarOptions = {
                events: events
              }
            },
            error:(err:string)=>{
              console.log(err);
              
            }
          })
        },
        error: (err)=>{
          console.log(err);
          
        }
      })
       
      }
    })
    
  }

}
