import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
//Dependencias
import * as CryptoJS from 'crypto-js';

@Injectable()
export class SecurityService {
  constructor(private readonly config: ConfigService) {}
  //Funcion que recibe un objeto y regresa una cadena con la informacion cifrada
  public encrypt(object2encrypt: object): string {
    const STRINGIFYOBJECT = JSON.stringify(object2encrypt);
    const CIPHEROBJECT: string = CryptoJS.AES.encrypt(
      STRINGIFYOBJECT,
      'claveSecreta',
    ).toString();
    return CIPHEROBJECT;
  } //Funcion que recibe un string y regresa un objeto descifrado
}
