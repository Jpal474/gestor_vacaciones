import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudCrear } from 'src/app/interfaces/crear_solicitud.interface';
import { Empleado, EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
import { Solicitud, SolicitudEstado } from 'src/app/interfaces/solicitud.interface';
import { TrabajadoresService } from 'src/app/services/trabajadores.service';
import * as moment from 'moment'; 
import { SolicitudEditar } from 'src/app/interfaces/solicitud-editar.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-solicitud',
  templateUrl: './editar-solicitud.component.html',
  styleUrls: ['./editar-solicitud.component.css']
})
export class EditarSolicitudComponent implements OnInit {
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
    private trabajadorService: TrabajadoresService,
    private router: Router,
    private activadedRoute: ActivatedRoute,
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {

    const params = this.activadedRoute.snapshot.params;
    this.id_solicitud = params['id'];
    if(params){
      this.trabajadorService.getSolicitudById(params['id'])
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
      
    this.trabajadorService.getEmpleadoByUserId(id_usuario)
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
    const dia = new Date().getDate();
    const mes = new Date().getMonth();
    let año = 0;
    if(dia >= 18 && mes === 12){
      año = new Date().getFullYear() + 1;
    }else{
      año = new Date().getFullYear()
    }
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
        console.log(err); 
      }
    })
  }


  crearFormulario(){
    this.solicitud_formulario = this.fb.group({
     fecha_inicio: ['', [Validators.required, this.minDateValidator, this.allowedDateValidator,]],
     fecha_fin: ['', Validators.required],
     justificacion: ['', Validators.maxLength(150)]
    },{
    validators:[ this.maxDateValidator('fecha_inicio', 'fecha_fin'), this.rangeDateValidator('fecha_inicio', 'fecha_fin')]
    });
  }

  updateSolicitud(){
    if(!this.solicitud_formulario.invalid){
      this.solicitud = this.solicitud_formulario.value;
      this.trabajadorService.updateSolicitud(this.id_solicitud, this.solicitud)
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

  allowedDateValidator(control: AbstractControl) {
    const fecha = moment(new Date(control.value), 'YYYY-MM-DD');
    const hoy = moment(new Date(), 'YYYY-MM-DD');
    if (hoy.year() + 1 === fecha.year()) {
      if (hoy.month() != 12 || (hoy.date() <= 16 && hoy.month() === 12)) {
        return { allowedDate: true };
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  rangeDateValidator(fecha_inicio: string, fecha_fin: string) {
    let mensaje = '';
    console.log('max.date');

    return (formGroup: FormGroup) => {
      const CONTROL = formGroup.controls[fecha_inicio];
      const CONTROL2 = formGroup.controls[fecha_fin];
      if (CONTROL.value === null || CONTROL2.value === null) {
        return;
      }
      const fecha_inicio2 = moment(CONTROL.value, 'YYYY/MM/DD');
      const fecha_fin2 = moment(CONTROL2.value, 'YYYY/MM/DD');

      if (!fecha_inicio2.isValid() || !fecha_fin2.isValid()) {
        return;
      }

      if (fecha_inicio2 && fecha_fin2 && fecha_inicio2 > fecha_fin2) {
        return { dateRange: true };
      }
      return null;
    };
  }

  get fechaInicioNoValida(): string {
    this.mensaje = '';
    if (
      this.solicitud_formulario.get('fecha_inicio')?.errors?.['required'] &&
      this.solicitud_formulario.get('fecha_inicio')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    } else if (
      this.solicitud_formulario.get('fecha_inicio')?.errors?.['minDate'] &&
      this.solicitud_formulario.get('fecha_inicio')?.touched
    ) {
      this.mensaje = 'La soicitud debe hacerse con 2 semanas de anticipación';
    } else if (
      this.solicitud_formulario.get('fecha_inicio')?.errors?.['allowedDate'] &&
      this.solicitud_formulario.get('fecha_inicio')?.touched
    ) {
      this.mensaje = 'Aún no puedes hacer una solicitud para el año siguiente';
    }
    return this.mensaje;
  }

  get fechaFinNoValida(): string {
    this.mensaje = '';
    if (
      this.solicitud_formulario.get('fecha_fin')?.errors?.['required'] &&
      this.solicitud_formulario.get('fecha_fin')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    } else if (
      this.solicitud_formulario.errors?.['maxDate'] &&
      this.solicitud_formulario.get('fecha_fin')?.touched
    ) {
      this.mensaje = 'Los días de la solicitud sobrepasan sus días disponibles';
    }
    else if (
      this.solicitud_formulario.errors?.['dateRange'] &&
      this.solicitud_formulario.get('fecha_fin')?.touched
    ) {
      this.mensaje = 'La fecha de fin debe ser posterior a la de incio';
    }
    return this.mensaje;
  }

  get justificacionNoValida(){
    this.mensaje='';
    if (
      this.solicitud_formulario.get('fecha_fin')?.errors?.['maxlength'] &&
      this.solicitud_formulario.get('fecha_fin')?.touched
    ) {
      this.mensaje = 'Máximo de caractere alcanzado';
  }
return this.mensaje;
}

}


