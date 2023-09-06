import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  metodos_pago = [
    '../../../../assets/recursos/imagenes/general/pagos/logos-tarjetas-credito.png',
    '../../../../assets/recursos/imagenes/general/pagos/paypal.png',
    '../../../../assets/recursos/imagenes/general/pagos/banktransfer-sp.png',
    '../../../../assets/recursos/imagenes/general/pagos/efectivo.png',
  ];
  titulos_pagos = [
    'Tarjeta Crédito/Débito',
    'Paypal',
    'STP',
    'Efectivo'
  ]
}
