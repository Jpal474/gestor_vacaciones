import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DiasFeriados } from '../interfaces/dias_feriados.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Empleado } from '../interfaces/empleados.interface';
import { Departamento } from '../interfaces/departamento.interface';
import { Empresa } from '../interfaces/empresa.interface';

@Injectable({
  providedIn: 'root'
})
export class SuperadService {
  FESTIVOS_URL= 'https://api.generadordni.es/v2/holidays/holidays?country=MX&year=2023'
  BASE_URL:string='http://localhost:3000'
  headers= new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  constructor(private httpClient: HttpClient) { }

  getDiasFeriados(): Observable<DiasFeriados[]>{
    console.log('entra');
    
    const date = new Date();
    const year = date.getFullYear();
    return this.httpClient.get<any>(this.FESTIVOS_URL);
  }

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

  createDepartamento(departamento: Departamento): Observable<Departamento>{
    return this.httpClient.post<Departamento>(`${this.BASE_URL}/departamento`, departamento)
  }

  deleteDepartamento(id: number): Observable<boolean>{
    return this.httpClient.delete<boolean>(`${this.BASE_URL}/departamento/${id}`)
  }
}
