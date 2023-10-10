import { Component, OnInit } from '@angular/core';
import { Empleado, EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
import { TrabajadoresService } from 'src/app/services/trabajadores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent implements OnInit {
  empleado: Empleado={
    id:'',
    nombre: '',
    apellidos: '',
    genero: EmpleadoGenero.OTRO,
    fecha_contratacion: '',
    usuario: {
      id:'',
      nombre_usuario: '',
      correo: '',
      contraseña: '',
    },
    departamento: {
      id: 0,
      nombre: ''
    }}
saldo_vacacional = {} as SaldoVacacional
constructor(private trabajadorService: TrabajadoresService) {}

 ngOnInit(): void {

  const id = JSON.parse(atob(localStorage.getItem('id')!))
  if(id){
    this.trabajadorService.getEmpleadoByUserId(id)
    .subscribe({
       next: (res: Empleado)=> {
        this.empleado = res;
        console.log(res);
        this.getSaldoVacacional()
        
       }
    })
  }
  
 }

 getSaldoVacacional(){
  const año = new Date().getFullYear()
      console.log('saldo');
      this.trabajadorService.getSaldoByEmpleadoId(this.empleado.id!, año)
      .subscribe({
        next: (res: SaldoVacacional)=> {
          if(res){
            this.saldo_vacacional = res;
            console.log(this.saldo_vacacional);
            
          }
        }, 
        error: (err)=> {
          const cadena:string = 'unknown error'
          if(cadena.includes(err)){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha habido un error al completar la solicitud',
            })
          }
          else if('unauthorized'.includes(err)){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Debe iniciar sesión para completar la acción',
            })
          }
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err,
          })
        }
      })
 }
}
