import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Departamento } from 'src/app/interfaces/departamento.interface';
import { Empleado, EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { SuperadService } from 'src/app/services/superad.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { SaldoActualizado } from 'src/app/interfaces/actualizar_saldo-vacacional.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
@Component({
  selector: 'app-editar-empleado',
  templateUrl: './editar-empleado.component.html',
  styleUrls: ['./editar-empleado.component.css']
})
export class EditarEmpleadoComponent {
  mensaje='';
  pass = '';
  rol = '';
  id_usuario ='';
  id_empleado = '';
  aux_fecha = '';
  empleado_formulario!: FormGroup;
  departamentos: Departamento[]= [];
  usuario: Usuario={
    nombre_usuario: '',
    correo: '',
    contraseña:'',
    }
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
    }
  }
  saldo_vacacional: SaldoActualizado={
    dias_disponibles: 0,
    dias_tomados: 0,
  }


  constructor(
    private fb: FormBuilder,
    private superadService: SuperadService,
    private router: Router,
    private activadedRoute: ActivatedRoute
  ) {
    this.crearFormulario();
  }

  crearFormulario(){
this.empleado_formulario= this.fb.group({
  nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), this.notOnlyWhitespace, Validators.minLength(3)]],
  apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-0-9]*$/), this.notOnlyWhitespace, Validators.minLength(3)]],
  nombre_usuario: ['', [Validators.required, this.notOnlyWhitespace]],
  correo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/), this.notOnlyWhitespace]],
  genero: ['', Validators.required],
  departamento: ['', Validators.required],
  fecha_contratacion: ['', [Validators.required, this.maxDateValidator]],
  contraseña: [''],
  confirmar_contraseña: [''],
})
  }

  ngOnInit(): void {
    this.getDepartamentos();
    const params = this.activadedRoute.snapshot.params;
    if(params){
      this.superadService.getEmpleadoById(params['id'])
      .subscribe({
        next: (res: Empleado)=> {
          console.log(res);
          this.id_usuario= res.usuario.id!;
          this.id_empleado=res.id!;
          this.empleado.id=res.id;
          this.usuario.id= res.usuario.id;
          this.pass = res.usuario.contraseña!;
          this.rol = res.usuario.rol?.nombre!;
          this.aux_fecha = res.fecha_contratacion;
          console.log(this.usuario.contraseña);
          
          this.empleado_formulario.patchValue({
            nombre: res.nombre,
            apellidos: res.apellidos,
            nombre_usuario: res.usuario.nombre_usuario,
            correo: res.usuario.correo,
            genero: res.genero,
            departamento: res.departamento.nombre,
            fecha_contratacion: res.fecha_contratacion,
            
          })
        }
      })
    }
    
  }

  getDepartamentos(){
    this.superadService.getDepartamentos()
    .subscribe({
      next: (res: Departamento[]) => {
        console.log(res);
        
        this.departamentos = res;
      }
    })
  }

  actualizarEmpleado(){    
    if (!this.empleado_formulario.invalid) {
      if(this.empleado_formulario.value['contraseña'].length > 0 && this.empleado_formulario.value['contraseña'].trim() === ''){
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña no puede consistir sólo en espacios en blanco',
        })
      }
      else if (this.empleado_formulario.value['contraseña'].length === 0){
        console.log('empleado sin contraseña');
        
           this.empleado.nombre = this.empleado_formulario.value['nombre'];
           this.empleado.apellidos = this.empleado_formulario.value['apellidos'];
           this.empleado.genero = this.empleado_formulario.value['genero'];
           this.empleado.fecha_contratacion = this.empleado_formulario.value['fecha_contratacion'];
           this.empleado.usuario.nombre_usuario = this.empleado_formulario.value['nombre_usuario'];
           this.empleado.usuario.correo = this.empleado_formulario.value['correo'];
           this.empleado.usuario.contraseña = this.pass;
           console.log('id_empleado',this.empleado.usuario.id);
           
           this.superadService.updateUsuario(this.empleado.usuario, this.id_usuario!)
           .subscribe({
            next: (res:Usuario)=> {
              this.empleado.usuario = res;
              if(this.rol === 'Administrador'){
               this.superadService.updateAdministrador(this.empleado, this.id_empleado!)
               .subscribe({
                next: (res: Empleado)=> {
                  if(res && this.aux_fecha !== this.empleado_formulario.value['fecha_contratacion']){
                    this.actualizarSaldoVacacional();
                  }
                  else if (res){
                    Swal.fire({
                      icon: 'success',
                      title: 'Éxito',
                      text: 'El Administrador ha sido guardado con éxito',
                    })
                  } 
                },
                error(err) {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err,
                  }) 
                  
                },
               })
              }
              else{
                this.superadService.updateTrabajador(this.empleado, this.id_empleado!)
                .subscribe({
                  next: (res: Empleado)=> {
                    if(res && this.aux_fecha !== this.empleado_formulario.value['fecha_contratacion']){
                      this.actualizarSaldoVacacional();
                    }
                    else if (res){
                      Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'El Administrador ha sido guardado con éxito',
                      })
                    }
                    
                  },
                  error(err) {
                    console.log('error',err);
                    
                  },
                })
              }
            },
            error(err) {
              console.log('error',err);
              
            },
           })
           
      }
      else{
        this.empleado.usuario.nombre_usuario = this.empleado_formulario.value['nombre_usuario'];
        this.empleado.usuario.correo = this.empleado_formulario.value['correo'];
        this.empleado.usuario.contraseña = this.empleado_formulario.value['contraseña'];
        this.superadService.updateUsuario(this.empleado.usuario, this.id_usuario!)
        .subscribe({
          next: (res: Usuario)=> {
            if(this.rol === 'Administrador'){
              this.superadService.updateAdministrador(this.empleado, this.id_empleado!)
              .subscribe({
               next: (res: Empleado)=> {
                 if(res && this.aux_fecha !== this.empleado_formulario.value['fecha_contratacion']){
                   this.actualizarSaldoVacacional();
                 }
                 else if (res){
                   Swal.fire({
                     icon: 'success',
                     title: 'Éxito',
                     text: 'El Administrador ha sido guardado con éxito',
                   })
                 } 
               },
               error(err) {
                 Swal.fire({
                   icon: 'error',
                   title: 'Error',
                   text: err,
                 }) 
                 
               },
              })
             }
             else{
               this.superadService.updateTrabajador(this.empleado, this.id_empleado!)
               .subscribe({
                 next: (res: Empleado)=> {
                   if(res && this.aux_fecha !== this.empleado_formulario.value['fecha_contratacion']){
                     this.actualizarSaldoVacacional();
                   }
                   else if (res){
                     Swal.fire({
                       icon: 'success',
                       title: 'Éxito',
                       text: 'El Trabajador ha sido guardado con éxito',
                     })
                   }
                   
                 },
                 error(err) {
                   console.log('error',err);
                   
                 },
               })
             }

          }
        })

        this.empleado = this.empleado_formulario.value;
        
        
      }
      
      console.log(this.empleado_formulario.value['contraseña'].length);
      
      
    } else {
      console.log(this.empleado_formulario);
      
    }
    
  }

async actualizarSaldoVacacional(){
  const año = new Date().getFullYear();
  const fechaFormateada = new Date().toISOString().split('T')[0];
  console.log(fechaFormateada, 'formateada');
  const actual = moment(fechaFormateada, 'YYYY/MM/DD');
  console.log('fecha_c', this.empleado.fecha_contratacion);
  const fecha_contratacion = moment(this.empleado.fecha_contratacion, 'YYYY/MM/DD');
  const diferencia = actual.diff(fecha_contratacion, 'years');
  console.log('actual', actual);
  console.log('fecha_contratacion', fecha_contratacion);
  console.log('diferencia', diferencia);
  if (diferencia > 0) {
    const { value: dias_tomados } = await Swal.fire({//ingresa el nombre del departamento
      title: 'Ingrese Los Dias Vacacionales Tomados Por Su Trabajador',
      input: 'text',
      inputLabel: 'En caso de no tener, deje en blanco el espacio',
      inputPlaceholder: 'Ingrese Nombre del Departamento',
    });   

    if(dias_tomados && parseInt(dias_tomados)>0){
      this.saldo_vacacional.dias_tomados = parseInt(dias_tomados);    
  }else if (dias_tomados && parseInt(dias_tomados) === 0){
    this.saldo_vacacional.dias_tomados = 0;
  }
    
    if (diferencia === 1) { 
      this.saldo_vacacional.dias_disponibles = 12-dias_tomados;
    } else if (diferencia === 2) {
      this.saldo_vacacional.dias_disponibles = 14-dias_tomados;

    } else if (diferencia === 3) {
      this.saldo_vacacional.dias_disponibles = 16-dias_tomados;

    } else if (diferencia === 4) {
      this.saldo_vacacional.dias_disponibles = 18-dias_tomados;
    } else if (diferencia === 5) {
      this.saldo_vacacional.dias_disponibles = 20-dias_tomados;
    } else if (diferencia >= 6 || diferencia <= 10) {
      this.saldo_vacacional.dias_disponibles = 22-dias_tomados;
    } else if (diferencia >= 11 || diferencia <= 15) {
      this.saldo_vacacional.dias_disponibles = 24-dias_tomados;
    } else if (diferencia >= 16 || diferencia <= 20) {
      this.saldo_vacacional.dias_disponibles = 26-dias_tomados;
    } else if (diferencia >= 21 || diferencia <= 25) {
      this.saldo_vacacional.dias_disponibles = 28-dias_tomados;
    } else if (diferencia >= 26 || diferencia <= 30) {
      this.saldo_vacacional.dias_disponibles = 30-dias_tomados;
    } else if (diferencia >= 31 || diferencia <= 35) {
      this.saldo_vacacional.dias_disponibles = 32-dias_tomados;
    }

  console.log('saldo vacacional',this.saldo_vacacional);
  }

  if(this.empleado.id){
this.superadService.updateSaldoVacacional(this.empleado.id!,año, this.saldo_vacacional)
.subscribe({
  next: (res: SaldoVacacional)=> {
    if(res){
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Los Datos Han Sido Actualizados de Forma Éxitosa',
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


  notOnlyWhitespace(control: AbstractControl) {
    if (control.value !== null && control.value.trim() === '') {
      return { notOnlyWhitespace: true };
    }
    return null;
  }

  maxDateValidator(control: AbstractControl) {
    const fechaContratacion = new Date(control.value);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaContratacion.getFullYear();
    const mesActual = hoy.getMonth();
    const mesContratacion = fechaContratacion.getMonth();

    if (
      mesActual < mesContratacion ||
      (mesActual === mesContratacion && hoy.getDate() < fechaContratacion.getDate())
    ) {
      // Si no ha cumplido años todavía
      edad--;
    }

    if (edad > 50) {
      return { maxAge: true };
    }

    return null;
  }

  get nombreNoValido(){
    this.mensaje='';
    if (
      this.empleado_formulario.get('nombre')?.errors?.['required'] &&
      this.empleado_formulario.get('nombre')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    } else if (this.empleado_formulario.get('nombre')?.errors?.['pattern']) {
      console.log('nombre no valido');
      
      this.mensaje = 'El nombre no puede contener números o carácteres especiales';
    } else if (
      this.empleado_formulario.get('nombre')?.errors?.['notOnlyWhitespace'] &&
      this.empleado_formulario.get('nombre')?.touched
    ) {
      this.mensaje = 'El nombre no puede consistir solo en espacios en blanco.';
    }
    else if (
      this.empleado_formulario.get('nombre')?.errors?.['minlength']
    ) {
      this.mensaje = 'El nombre debe tener al menos 3 letras';
    }
    return this.mensaje;
  }

  get apellidosNoValidos(){
    this.mensaje='';
    if( this.empleado_formulario.get('apellidos')?.errors?.['required'] && this.empleado_formulario.get('apellidos')?.touched){
      this.mensaje= "El campo no puede estar vacío";
    }
    else if(this.empleado_formulario.get('apellidos')?.errors?.['pattern']){
      this.mensaje= "El/Los apellidos no pueden contener números o carácteres especiales";
    }
    else if(this.empleado_formulario.get('apellidos')?.errors?.['notOnlyWhitespace'] && this.empleado_formulario.get('apellidos')?.touched) {
      this.mensaje= "El campo no puede consistir sólo en espacios en blanco.";
    }
    else if(this.empleado_formulario.get('apellidos')?.errors?.['minlength']) {
      this.mensaje= "Los apellidos debe contener al menos 3 letras";
    }
    return this.mensaje
  }

  get nombreUsuarioNoValido(){
    this.mensaje='';
    if( this.empleado_formulario.get('nombre_usuario')?.errors?.['required'] && this.empleado_formulario.get('nombre_usuario')?.touched){
      this.mensaje = "El campo no puede estar vacío";
    } 
    else if( this.empleado_formulario.get('nombre_usuario')?.errors?.['notOnlyWhitespace'] && this.empleado_formulario.get('nombre_usuario')?.touched){
      this.mensaje = "El campo no puede consistir sólo en espacios en blanco"
    }
    else if(this.empleado_formulario.get('nombre_usuario')?.errors?.['minlength']) {
      this.mensaje= "El nombre de usuario debe contener al menos 3 letras";
    }
    return this.mensaje
  }

  get correoNoValido() {
    this.mensaje='';
    if (
      this.empleado_formulario.get('correo')?.errors?.['required'] &&
      this.empleado_formulario.get('correo')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    } else if (this.empleado_formulario.get('correo')?.errors?.['pattern']) {
      this.mensaje = 'Ingrese un formato de correo válido';
    }
    return this.mensaje;
  }

  get departamentoNoValido(){
    if(this.empleado_formulario.get('departamento')?.invalid && this.empleado_formulario.get('departamento')?.touched){
     this.mensaje = 'El campo no puede estar vacío';
    }
    return this.mensaje;
  }

  get generoNoValido(){
    this.mensaje='';
    if(this.empleado_formulario.get('genero')?.invalid && this.empleado_formulario.get('genero')?.touched){
      this.mensaje = "El campo no puede estar vacío";
    }
    return this.mensaje;
  }

  get fechaNoValida(){
    this.mensaje;
    if (this.empleado_formulario.get('fecha_contratacion')?.invalid && this.empleado_formulario.get('fecha_contratacion')?.touched){
      this.mensaje = "El campo no puede estar vacío"
    }
    return this.mensaje;
  }

  get contraseniaNoValido() {
    return (
      this.empleado_formulario.get('contraseña')?.invalid &&
      this.empleado_formulario.get('contraseña')?.touched
    );
  }
  get confirmarContraseniaNoValida() {
    const pass1 = this.empleado_formulario.get('contraseña')?.value;
    const pass2 = this.empleado_formulario.get('confirmar_contraseña')?.value;

    return pass1.localeCompare(pass2, undefined, { sensitivity: 'case' }) === 0
      ? false
      : true;
  }

}
