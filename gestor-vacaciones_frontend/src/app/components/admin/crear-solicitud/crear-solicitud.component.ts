import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SolicitudCrear } from 'src/app/interfaces/crear_solicitud.interface';
import { Empleado, EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
import { Solicitud, SolicitudEstado } from 'src/app/interfaces/solicitud.interface';
import { TrabajadoresService } from 'src/app/services/trabajadores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent {
  mensaje = '';
  solicitud_formulario!: FormGroup;
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
  solicitud: SolicitudCrear={
    fecha_inicio: '',
    fecha_fin: '',
    estado: SolicitudEstado.PENDIENTE,
    justificacion: '',
    empleado: {
      id: '',
      nombre: '',
      apellidos: '',
      genero: EmpleadoGenero.OTRO,
      fecha_contratacion: '',
    }
  }

  constructor(
    private fb: FormBuilder,
    private trabajadorService: TrabajadoresService,
    private router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    console.log('entra onInit');
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
      },
      complete: ()=>{
        console.log('complete');
        
      }
    })
  
  }
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

    crearSolicitud(){
      if(!this.solicitud_formulario.invalid){
       this.solicitud.fecha_inicio = this.solicitud_formulario.value['fecha_inicio'];
       this.solicitud.fecha_fin = this.solicitud_formulario.value['fecha_fin'];
       this.solicitud.justificacion = this.solicitud_formulario.value['justificacion'];
      this.solicitud.empleado.id = this.empleado.id!;
      this.solicitud.empleado.nombre = this.empleado.nombre;
      this.solicitud.empleado.apellidos = this.empleado.apellidos;
      this.solicitud.empleado.genero = this.empleado.genero;
      this.solicitud.empleado.fecha_contratacion;
      this.trabajadorService.createSolicitud(this.solicitud)
      .subscribe({
        next: (res: Solicitud)=> {
          if(res){
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'La Solicitud Ha Sido Creada con Éxito',
            }),
            setTimeout(() =>{
              this.router.navigate(['/trabajador/solicitud',res.id])
              }, 2000);}
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
          console.log(err); 
        }
      })
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
       console.log(diferencia);
       
      if (diferencia > this.saldo_vacacional.dias_disponibles){
        console.log('demasiados dias');
        
        return { maxDate: true };

      }
      return null;
      }
    }

   get fechaInicioNoValida(): string{
    this.mensaje='';
    if (
      this.solicitud_formulario.get('fecha_inicio')?.errors?.['required'] &&
      this.solicitud_formulario.get('fecha_inicio')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    }else if (this.solicitud_formulario.get('fecha_inicio')?.errors?.['minDate'] &&
    this.solicitud_formulario.get('fecha_inicio')?.touched ){
      this.mensaje = 'La soicitud debe hacerse con 2 semanas de anticipación';

    }
    return this.mensaje;
   }

   get fechaFinNoValida(): string{
    this.mensaje=''
    if (
      this.solicitud_formulario.get('fecha_fin')?.errors?.['required'] &&
      this.solicitud_formulario.get('fecha_fin')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    }else if (this.solicitud_formulario.errors?.['maxDate'] &&
    this.solicitud_formulario.get('fecha_fin')?.touched){
      this.mensaje = 'Los días de la solicitud sobrepasan sus días disponibles';

    }
    return this.mensaje;
   }

}
