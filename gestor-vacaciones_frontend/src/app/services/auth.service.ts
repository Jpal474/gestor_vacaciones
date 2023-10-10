import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Login } from '../interfaces/login.interface';
import {JwtHelperService } from '@auth0/angular-jwt'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASE_URL:string='http://localhost:3000'
  public jwtHelper: JwtHelperService = new JwtHelperService();
  constructor(
    private httpClient: HttpClient,
    private router: Router
    ) { }

  getAuth(correo:string, contraseña:string): Observable<Login> {
      return this.httpClient.post<Login>(`${this.BASE_URL}/auth/signin`, { correo, contraseña });
      
    }
  decodeUserFromToken(token: string) {
      return this.jwtHelper.decodeToken(token);
    }
    logOut(){
      localStorage.clear();
      this.router.navigate(['login'])
      
  
      
    }

    enviarMail(destinatario: string){

    }
  
}
