import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiasFeriados } from '../interfaces/dias_feriados.interface';
import { Observable } from 'rxjs';
import { Departamento } from '../interfaces/departamento.interface';
import { Empresa } from '../interfaces/empresa.interface';
import { Empleado } from '../interfaces/empleados.interface';
import { Solicitud } from '../interfaces/solicitud.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { RechazarSolicitud } from '../interfaces/rechazar_solicitud.interface';
import { AprobarSolicitud } from '../interfaces/aprobar_solicitud.interface';
import { SaldoVacacional } from '../interfaces/saldo_vacacional.interface';
import { SaldoActualizado } from '../interfaces/actualizar_saldo-vacacional.interface';
import { SolicitudEditar } from '../interfaces/solicitud-editar.interface';
import { EmailTrabajadores } from '../interfaces/email_trabajadores.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  BASE_URL:string='http://localhost:3000'
  headers= new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  constructor(private httpClient: HttpClient) { }

  getDepartamentos(): Observable<Departamento[]>{
    return this.httpClient.get<Departamento[]>(`${this.BASE_URL}/departamento`)
  }

  getEmpresa(): Observable<Empresa>{
    return this.httpClient.get<Empresa>(`${this.BASE_URL}/empresa`)
  }

  getTrabajadores():Observable<Empleado[]>{
    return this.httpClient.get<Empleado[]>(`${this.BASE_URL}/trabajador`)
  }

  getSolicitudesTrabajadores(): Observable<Solicitud[]>{
    return this.httpClient.get<Solicitud[]>(`${this.BASE_URL}/solicitud/trabajadores`);
  }

  getSolicitudesAprobadas(): Observable<Solicitud[]>{
    return this.httpClient.get<Solicitud[]>(`${this.BASE_URL}/solicitud/aprobadas`)
  }

  getMisSolicitudes(id: string): Observable<Solicitud[]>{
    return this.httpClient.get<Solicitud[]>(`${this.BASE_URL}/solicitud/empleados/${id}`)
   }

  getDepartamentoById(id: number): Observable<Departamento>{
    return this.httpClient.get<Departamento>(`${this.BASE_URL}/departamento/${id}`)
  }

  getEmpleadoByUserId(id: string): Observable<Empleado>{
    return this.httpClient.get<Empleado>(`${this.BASE_URL}/empleado/usuario/${id}`)
  }

  getEmpleadoById(id: string): Observable<Empleado>{
    return this.httpClient.get<Empleado>(`${this.BASE_URL}/empleado/${id}`)
  }

  getSaldoByEmpleadoId(id: string, anio: number){
    return this.httpClient.get<SaldoVacacional>(`${this.BASE_URL}/saldo-vacacional/${id}/${anio}`)

  }

  getSolicitudById(id: number): Observable<Solicitud>{
    return this.httpClient.get<Solicitud>(`${this.BASE_URL}/solicitud/${id}`);
  }

  enviarMailRechazada(): Observable<boolean>{
    let destinatario = 'lovad28459@apxby.com'
    return this.httpClient.post<boolean>(`${this.BASE_URL}/admin/email/rechazar/${destinatario}`, {})
  }

  enviarMailAprobada(): Observable<boolean>{
    let destinatario = 'lovad28459@apxby.com'
    return this.httpClient.post<boolean>(`${this.BASE_URL}/admin/email/aprobar/${destinatario}`, {})
  }

  enviarMailSolicitud(): Observable<boolean>{
    const mail: EmailTrabajadores ={
      nombre: 'Edgar Iván Blas Peña',
      destinatarios:['lovad28459@apxby.com']
    }
    return this.httpClient.post<boolean>(`${this.BASE_URL}/admin/email/solicitud/`, mail)
  }

  createDepartamento(departamento: Departamento): Observable<Departamento>{
    return this.httpClient.post<Departamento>(`${this.BASE_URL}/departamento`, departamento)
  }

  createUsuario(usuario: Usuario): Observable<Usuario>{
    return this.httpClient.post<Usuario>(`${this.BASE_URL}/usuario`, usuario);
  }

  createTrabajador(trabajador: Empleado): Observable<Empleado>{
    return this.httpClient.post<Empleado>(`${this.BASE_URL}/trabajador`, trabajador)
  }

  createSaldoVacacional(saldo_vacacional: SaldoVacacional): Observable<SaldoVacacional>{
    return this.httpClient.post<SaldoVacacional>(`${this.BASE_URL}/saldo-vacacional`, saldo_vacacional)
  }

  updateUsuario(usuario: Usuario, id:string): Observable<Usuario>{
    console.log('id usuario', id);
    
    return this.httpClient.put<Usuario>(`${this.BASE_URL}/usuario/${id}`, usuario);
  }

  updateTrabajador(trabajador: Empleado, id:string): Observable<Empleado>{
    return this.httpClient.put<Empleado>(`${this.BASE_URL}/trabajador/${id}`, trabajador);
  }

  updateSaldoVacacional(id: string, anio: number, saldoActualizado: SaldoActualizado): Observable<SaldoVacacional>{
    return this.httpClient.put<SaldoVacacional>(`${this.BASE_URL}/saldo-vacacional/${id}/${anio}`, saldoActualizado)
  }

  updateSolicitud(id: number, solicitud: SolicitudEditar): Observable<Solicitud>{
    return this.httpClient.put<Solicitud>(`${this.BASE_URL}/solicitud/${id}`, solicitud);
  }

  rechazarSolicitud(nombre: RechazarSolicitud, id:number){
    return this.httpClient.put<boolean>(`${this.BASE_URL}/solicitud/denegar/${id}`, nombre);
  }

  aprobarSolicitud(nombre:AprobarSolicitud, id:number){
    return this.httpClient.put<boolean>(`${this.BASE_URL}/solicitud/aprobar/${id}`, nombre);
  }


  deleteDepartamento(id: number): Observable<boolean>{
    return this.httpClient.delete<boolean>(`${this.BASE_URL}/departamento/${id}`)
  }
  
  deleteUsuario(id:string): Observable<boolean>{
    return this.httpClient.delete<boolean>(`${this.BASE_URL}/usuario/${id}`)
  }
 
}
