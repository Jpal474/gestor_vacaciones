import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiasFeriados } from '../interfaces/dias_feriados.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient: HttpClient) { }
 
}
