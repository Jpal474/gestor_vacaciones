import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudCrear } from 'src/app/interfaces/crear_solicitud.interface';
import { Empleado, EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
import { Solicitud, SolicitudEstado } from 'src/app/interfaces/solicitud.interface';
import { TrabajadoresService } from 'src/app/services/trabajadores.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { EmailTrabajadores } from 'src/app/interfaces/email_trabajadores.interface';
import { DiasFeriados } from 'src/app/interfaces/dias_feriados.interface';
import { FestivosService } from 'src/app/services/festivos.service';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {
  mensaje = '';
  dias_festivos: string [] = [];
  reglas: string [] = ["01-01", "1st monday in Frebruary", "3rd monday in March", "05-01","09-16", "3rd monday in November", "12-01 every 6 years since 1934", "12-25" ];
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
  mail: EmailTrabajadores={
    nombre: '',
    destinatarios: []
  }

  constructor(
    private fb: FormBuilder,
    private trabajadorService: TrabajadoresService,
    private festivosService: FestivosService,
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
        this.festivosService.getDiasFeriados()
        .subscribe({
          next: (res: DiasFeriados[])=> {
            let i = 0;
            res.map(event =>{
              if(event.type === 'public' && this.reglas.includes(event.rule)){
               this.dias_festivos[i] = moment(event.date).format('YYYY-MM-DD')
               i++;
              }
           }); 
          },
          error: (err)=> {
            console.log(err);
            
          }
        })
        
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
            this.enviarMail();
            setTimeout(() =>{
              this.router.navigate(['/trabajador/solicitud',res.id])
              }, 3000);}
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

    enviarMail(){
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      })
      
      Toast.fire({
        icon: 'success',
        title: 'Enviando Notificación de Solicitud'
      })
      this.mail.nombre = this.empleado.nombre + this.empleado.apellidos;
      this.trabajadorService.getMails()
      .subscribe({
        next: (res: string[])=> {
          if(res){
          this.mail.destinatarios = ['lovad28459@apxby.com', 'l18121471@morelia.tecnm.mx'];
          this.trabajadorService.enviarMail(this.mail)
          .subscribe({
            next: (res: boolean)=>{
              if (res){
                Swal.fire({
                  icon: 'success',
                  title: 'Éxito',
                  text: 'Notificación Enviada',
                })
              }
            }
          })
        }
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

    maxDateValidator(fecha_inicio: string, fecha_fin: string) {
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
        const fecha_actual = fecha_inicio2;
        let diferencia = 0;
        while (fecha_actual.isSameOrBefore(fecha_fin2)) {
          if (fecha_actual.day() !== 0 && fecha_actual.day() !== 6) {
            // Si no es domingo (0) ni sábado (6), cuenta como día laborable
            // Además, verifica si la fecha actual está en la lista de días festivos
            const fechaActualString = fecha_actual.format('YYYY-MM-DD');
            if (!this.dias_festivos.includes(fechaActualString)) {
              diferencia++;
            } else {
              console.log('Día feriado');
            }
          }
          fecha_actual.add(1, 'days'); // Avanza un día
        }
        console.log(diferencia);
    
        if (diferencia > this.saldo_vacacional.dias_disponibles) {
          console.log('Demasiados días');
    
          return { maxDate: true };
        }
        return null;
      };
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


  

