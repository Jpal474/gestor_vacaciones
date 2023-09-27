import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DiasFeriados } from '../interfaces/dias_feriados.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Empleado } from '../interfaces/empleados.interface';
import { Departamento } from '../interfaces/departamento.interface';
import { Empresa } from '../interfaces/empresa.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { Solicitud } from '../interfaces/solicitud.interface';
import { AprobarSolicitud } from '../interfaces/aprobar_solicitud.interface';
import { RechazarSolicitud } from '../interfaces/rechazar_solicitud.interface';
import { SaldoVacacional } from '../interfaces/saldo_vacacional.interface';
import { SaldoActualizado } from '../interfaces/actualizar_saldo-vacacional.interface';

@Injectable({
  providedIn: 'root'
})
export class SuperadService {
  BASE_URL:string='http://localhost:3000'
  headers= new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  constructor(private httpClient: HttpClient) { }

  getAdministradores():Observable<Empleado[]>{
    return this.httpClient.get<Empleado[]>(`${this.BASE_URL}/admin`)
  }

  getTrabajador():Observable<Empleado[]>{
    return this.httpClient.get<Empleado[]>(`${this.BASE_URL}/trabajador`)
  }

  getDepartamentos(): Observable<Departamento[]>{
    return this.httpClient.get<Departamento[]>(`${this.BASE_URL}/departamento`)
  }

  getEmpresa(): Observable<Empresa>{
    return this.httpClient.get<Empresa>(`${this.BASE_URL}/empresa`)
  }

  getDepartamentoById(id: number): Observable<Departamento>{
    return this.httpClient.get<Departamento>(`${this.BASE_URL}/departamento/${id}`)
  }

  getEmpleadoById(id: string): Observable<Empleado>{
    return this.httpClient.get<Empleado>(`${this.BASE_URL}/empleado/${id}`)
  }
  
  getSolicitudById(id: number): Observable<Solicitud>{
    return this.httpClient.get<Solicitud>(`${this.BASE_URL}/solicitud/${id}`);
  }

  getSolicitudesAprobadas(): Observable<Solicitud[]>{
    return this.httpClient.get<Solicitud[]>(`${this.BASE_URL}/solicitud/aprobadas`)
  }

  getNumeroSolicitudesAprobadas(): Observable<Number>{
    return this.httpClient.get<Number>(`${this.BASE_URL}/solicitud/contar_solicitudes`)
  }

  createDepartamento(departamento: Departamento): Observable<Departamento>{
    return this.httpClient.post<Departamento>(`${this.BASE_URL}/departamento`, departamento)
  }

  deleteDepartamento(id: number): Observable<boolean>{
    return this.httpClient.delete<boolean>(`${this.BASE_URL}/departamento/${id}`)
  }

  createUsuario(usuario: Usuario): Observable<Usuario>{
    return this.httpClient.post<Usuario>(`${this.BASE_URL}/usuario`, usuario);
  }

  createAdministrador(administrador: Empleado): Observable<Empleado>{
    return this.httpClient.post<Empleado>(`${this.BASE_URL}/admin`, administrador)
  }
  createTrabajador(trabajador: Empleado): Observable<Empleado>{
    return this.httpClient.post<Empleado>(`${this.BASE_URL}/trabajador`, trabajador)
  }

  createSaldoVacacional(saldo_vacacional: SaldoVacacional): Observable<SaldoVacacional>{
    return this.httpClient.post<SaldoVacacional>(`${this.BASE_URL}/saldo-vacacional`, saldo_vacacional)
  }

  updateUsuario(usuario: Usuario, id:string): Observable<Usuario>{
    return this.httpClient.put<Usuario>(`${this.BASE_URL}/usuario/${id}`, usuario);
  }

  updateAdministrador(administrador: Empleado, id:string): Observable<Empleado>{
    return this.httpClient.put<Empleado>(`${this.BASE_URL}/admin/${id}`, administrador);
  }

  updateTrabajador(trabajador: Empleado, id:string): Observable<Empleado>{
    return this.httpClient.put<Empleado>(`${this.BASE_URL}/trabajador/${id}`, trabajador);
  }

  updateSaldoVacacional(id: string, anio: number, saldoActualizado: SaldoActualizado): Observable<SaldoVacacional>{
    return this.httpClient.put<SaldoVacacional>(`${this.BASE_URL}/saldo-vacacional/${id}/${anio}`, saldoActualizado)
  }

  getSolicitudesAdmins(): Observable<Solicitud[]>{
    return this.httpClient.get<Solicitud[]>(`${this.BASE_URL}/solicitud`);
  }
  getSolicitudesTrabajadores(): Observable<Solicitud[]>{
    return this.httpClient.get<Solicitud[]>(`${this.BASE_URL}/solicitud/trabajadores`);
  }

  rechazarSolicitud(nombre: RechazarSolicitud, id:number){
    return this.httpClient.put<boolean>(`${this.BASE_URL}/solicitud/denegar/${id}`, nombre);
  }

  aprobarSolicitud(nombre:AprobarSolicitud, id:number){
    return this.httpClient.put<boolean>(`${this.BASE_URL}/solicitud/aprobar/${id}`, nombre);
  }

  deleteUsuario(id:string): Observable<boolean>{
    return this.httpClient.delete<boolean>(`${this.BASE_URL}/usuario/${id}`)
  }
}
