import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiasFeriados } from '../interfaces/dias_feriados.interface';
import { Observable } from 'rxjs';
import { Departamento } from '../interfaces/departamento.interface';
import { Empresa } from '../interfaces/empresa.interface';
import { Empleado } from '../interfaces/empleados.interface';
import { Solicitud } from '../interfaces/solicitud.interface';
import { Usuario } from '../interfaces/usuario.interface';

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

  getDepartamentoById(id: number): Observable<Departamento>{
    return this.httpClient.get<Departamento>(`${this.BASE_URL}/departamento/${id}`)
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

  deleteDepartamento(id: number): Observable<boolean>{
    return this.httpClient.delete<boolean>(`${this.BASE_URL}/departamento/${id}`)
  }
 
}
