import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiasFeriados } from '../interfaces/dias_feriados.interface';
import { Empleado } from '../interfaces/empleados.interface';
import { Solicitud } from '../interfaces/solicitud.interface';
import { SaldoVacacional } from '../interfaces/saldo_vacacional.interface';
import { SolicitudCrear } from '../interfaces/crear_solicitud.interface';
import { SolicitudEditar } from '../interfaces/solicitud-editar.interface';


@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {

BASE_URL: string='http://localhost:3000';
headers= new HttpHeaders({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});
  constructor(private httpClient: HttpClient) { }

  getEmpleadoByUserId(id: string): Observable<Empleado>{
    return this.httpClient.get<Empleado>(`${this.BASE_URL}/empleado/usuario/${id}`)
  }
  
  getSolicitudes(id: string): Observable<Solicitud[]>{
   return this.httpClient.get<Solicitud[]>(`${this.BASE_URL}/solicitud/empleados/${id}`)
  }

  getSolicitudById(id: number): Observable<Solicitud>{
    return this.httpClient.get<Solicitud>(`${this.BASE_URL}/solicitud/${id}`);
  }

  getSaldoByEmpleadoId(id: string, anio: number){
    return this.httpClient.get<SaldoVacacional>(`${this.BASE_URL}/saldo-vacacional/${id}/${anio}`)

  }

  createSolicitud(solicitud: SolicitudCrear): Observable<Solicitud>{
  return this.httpClient.post<Solicitud>(`${this.BASE_URL}/solicitud`, solicitud)
  }

  updateSolicitud(id: number, solicitud: SolicitudEditar): Observable<Solicitud>{
    return this.httpClient.put<Solicitud>(`${this.BASE_URL}/solicitud/${id}`, solicitud);
  }

}
