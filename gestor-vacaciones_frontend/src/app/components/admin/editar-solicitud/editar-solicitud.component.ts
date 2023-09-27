import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Empleado, EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
import { SolicitudEditar } from 'src/app/interfaces/solicitud-editar.interface';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-solicitud',
  templateUrl: './editar-solicitud.component.html',
  styleUrls: ['./editar-solicitud.component.css']
})
export class EditarSolicitudComponent {
  id_solicitud = 0;
  solicitud_formulario!: FormGroup;
  mensaje = '';
  empleado: Empleado = {
    nombre: '',
    apellidos: '',
    genero: EmpleadoGenero.OTRO,
    fecha_contratacion: '',
    usuario: {
      id: '',
      nombre_usuario: '',
      correo: '',
      contraseña: '',
    },
    departamento: {
      id: 0,
      nombre: '',
    },
  };
  saldo_vacacional: SaldoVacacional={
      año: 0,
      dias_disponibles: 0,
      dias_tomados: 0,
      empleado:  {
        id:'',
        nombre: '',
        apellidos:'',
        genero: EmpleadoGenero.OTRO,
        fecha_contratacion: '',
      }
  }
  solicitud: SolicitudEditar={
    fecha_inicio: '',
    fecha_fin: '',
    justificacion: '',
  }



  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private activadedRoute: ActivatedRoute,
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {

    const params = this.activadedRoute.snapshot.params;
    this.id_solicitud = params['id'];
    if(params){
      this.adminService.getSolicitudById(params['id'])
      .subscribe({
        next: (res: Solicitud)=> {
          if(res){
            this.solicitud_formulario.patchValue({
              fecha_inicio: res.fecha_inicio,
              fecha_fin : res.fecha_fin,
              justificacion: res.justificacion
            })
          }
        },
        error: (err)=> {

        },
        complete: ()=> {
          const id_usuario= JSON.parse(atob(localStorage.getItem('id')!))
    if(id_usuario){
      console.log(id_usuario);
      
    this.adminService.getEmpleadoByUserId(id_usuario)
    .subscribe({
      next: (res:Empleado)=> {
        console.log(res);
        
           if(res){
            this.empleado = res;
            console.log(this.empleado);
            this.getSaldoVacacional();  
           }
      },
      error: (err)=> {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err,
        }) 
      }
    })
          }
      }
    }
    )}
  }

  getSaldoVacacional(){
    const año = new Date().getFullYear()
    console.log('saldo');
    this.adminService.getSaldoByEmpleadoId(this.empleado.id!, año)
    .subscribe({
      next: (res: SaldoVacacional)=> {
        if(res){
          this.saldo_vacacional = res;
          console.log(this.saldo_vacacional);
          
        }
      }, 
      error: (err)=> {
        console.log(err); 
      }
    })
  }


  crearFormulario(){
    this.solicitud_formulario = this.fb.group({
     fecha_inicio: ['', [Validators.required, this.minDateValidator]],
     fecha_fin: ['', Validators.required],
     justificacion: ['']
    },{
    validators:[ this.maxDateValidator('fecha_inicio', 'fecha_fin')]
    });
  }

  updateSolicitud(){
    if(!this.solicitud_formulario.invalid){
      this.solicitud = this.solicitud_formulario.value;
      this.adminService.updateSolicitud(this.id_solicitud, this.solicitud)
      .subscribe({
        next: (res: Solicitud)=> {
          if(res){
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'La Solicitud Ha Sido Actualizada!',
          }) 
        }
        },
        error: (err)=> {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err,
          }) 
        }
      })
    }
  }

  minDateValidator(control: AbstractControl) {
    const fechaInicio = moment(new Date(control.value), 'YYYY/MM/DD');    
    const hoy = moment(new Date().toISOString().split('T')[0], 'YYYY/MM/DD');
    const diferencia = fechaInicio.diff(hoy, 'days');
    if (diferencia <= 14) {
      console.log('poca anticipacion');
      
      return { minDate: true };
    }

    return null;
  }

  maxDateValidator(fecha_inicio:string, fecha_fin:string) {
    let mensaje=''
    console.log('max.date');
    
    return (formGroup: FormGroup) => {
      const CONTROL = formGroup.controls[fecha_inicio];
      const CONTROL2 = formGroup.controls[fecha_fin];
      if (CONTROL.value === null || CONTROL2.value === null ){
        return;
      } 
       const fecha_inicio2 = moment(CONTROL.value, 'YYYY/MM/DD');
       const fecha_fin2 = moment(CONTROL2.value, 'YYYY/MM/DD');
      
      if (!fecha_inicio2.isValid() || !fecha_fin2.isValid()) {
        return;
      }
      const fecha_actual= fecha_inicio2;
      let diferencia = 0;
    while (fecha_actual.isSameOrBefore(fecha_fin2)) {
      if (fecha_actual.day() !== 0 && fecha_actual.day() !== 6) {
        // Si no es domingo (0) ni sábado (6), cuenta como día laborable
        diferencia++;
      }
      fecha_actual.add(1, 'days'); // Avanza un día
    }
     console.log(diferencia, 'diferencia');
     
    if (diferencia > this.saldo_vacacional.dias_disponibles){
      console.log('dias disponibles', this.saldo_vacacional.dias_disponibles);
      
      console.log('demasiados dias');
      
      return { maxDate: true };

    }
    return null;
    }
  }
}