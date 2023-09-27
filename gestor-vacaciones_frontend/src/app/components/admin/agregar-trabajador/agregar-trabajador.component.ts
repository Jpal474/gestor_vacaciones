import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Departamento } from 'src/app/interfaces/departamento.interface';
import { Empleado, EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';
import * as moment from 'moment'; 

@Component({
  selector: 'app-agregar-trabajador',
  templateUrl: './agregar-trabajador.component.html',
  styleUrls: ['./agregar-trabajador.component.css']
})
export class AgregarTrabajadorComponent {
  trabajador_formulario!: FormGroup;
  mensaje='';
  departamentos: Departamento[]= [];
  usuario: Usuario={
    nombre_usuario: '',
    correo: '',
    contraseña:'',
    }
  trabajador: Empleado={
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
  saldo_vacacional: SaldoVacacional = {
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


  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.crearFormulario();
  }

 ngOnInit(): void {
    this.getDepartamentos();
    
  }

  crearFormulario(){
    this.trabajador_formulario= this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/), this.notOnlyWhitespace, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-0-9]*$/), this.notOnlyWhitespace, Validators.minLength(3)]],
      nombre_usuario: ['', [Validators.required, this.notOnlyWhitespace]],
      correo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/), this.notOnlyWhitespace]],
      genero: ['', Validators.required],
      departamento: ['', Validators.required],
      fecha_contratacion: ['', [Validators.required, this.maxDateValidator]],
      contraseña: ['', [Validators.required, this.notOnlyWhitespace]],
      confirmar_contraseña: ['', [Validators.required, this.notOnlyWhitespace]],
    })
      }

getDepartamentos(){
  this.adminService.getDepartamentos()
  .subscribe({
      next: (res: Departamento[]) => {
          console.log(res);
          this.departamentos = res;
          }
        })
      }

      guardarTrabajador(){
        if (!this.trabajador_formulario.invalid){
          const { confirmar_contraseña: _, ...nuevoTrabajador } =
            this.trabajador_formulario.value;
            this.usuario.nombre_usuario = nuevoTrabajador.nombre_usuario;
            this.usuario.correo = nuevoTrabajador.correo;
            this.usuario.contraseña = nuevoTrabajador.contraseña;
          this.usuario.rol ={
            id: 3,
            nombre: 'Trabajador'
          }
            
            this.adminService.createUsuario(this.usuario)
             .subscribe({
              next: (res:Usuario) => {//subsribe de crear usuario
                this.trabajador.usuario = res;
                console.log('trabajador despues de usuario', this.trabajador);
                this.adminService.getDepartamentoById(this.trabajador_formulario.value['departamento'])
                .subscribe({ //subscribe de obtener departamento
                  next: (res:Departamento)=> {
                    this.trabajador.departamento=res;
                    this.trabajador.nombre = nuevoTrabajador.nombre;
                    this.trabajador.apellidos = nuevoTrabajador.apellidos;
                    this.trabajador.genero = nuevoTrabajador.genero;
                    this.trabajador.fecha_contratacion = nuevoTrabajador.fecha_contratacion.toString();
                    this.trabajador.usuario
                      this.adminService.createTrabajador(this.trabajador)
                      .subscribe({
                        next: (res: Empleado)=> {
                          if(res){
                            this.saldo_vacacional.empleado.id = res.id!;
                            this.createSaldoVacacional();
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
                  },
                  error(err) {                
                    Swal.fire({
                      icon: 'error',
                      title: 'Error',
                      text: err,
                    })   
                  },
                })//cierre subscribe de obtener departamento 
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
          return Object.values( this.trabajador_formulario.controls ).forEach( control => {
            if ( control instanceof FormGroup ) {
              Object.values( control.controls ).forEach( control => control.markAsTouched() );
            } else {
              control.markAsTouched();
            }
          });
        }
    }
    

    async createSaldoVacacional() {
      const fechaActual = new Date();
      const fechaFormateada = fechaActual.toISOString().split('T')[0]; 
      console.log(fechaFormateada, 'formateada');
      const actual = moment(fechaFormateada, 'YYYY/MM/DD');
      console.log('fecha_c', this.trabajador.fecha_contratacion);
      const fecha_contratacion = moment(this.trabajador.fecha_contratacion, 'YYYY/MM/DD');
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
  
        this.saldo_vacacional.empleado.nombre = this.trabajador.nombre;
        this.saldo_vacacional.empleado.apellidos = this.trabajador.apellidos;
        this.saldo_vacacional.empleado.genero = this.trabajador.genero;
        this.saldo_vacacional.empleado.fecha_contratacion = this.trabajador.fecha_contratacion; 
        console.log(this.saldo_vacacional.empleado);
        
        this.saldo_vacacional.año = actual.year();
        
      if(dias_tomados && parseInt(dias_tomados)>0){
        this.saldo_vacacional.dias_tomados = parseInt(dias_tomados);    
    }else if (!(dias_tomados) || parseInt(dias_tomados) === 0){
      this.saldo_vacacional.dias_tomados = 0;
    }
    console.log(dias_tomados, 'dias_tomados');
    
      
      if (diferencia === 1) { 
        this.saldo_vacacional.dias_disponibles = 12-this.saldo_vacacional.dias_tomados;
      } else if (diferencia === 2) {
        this.saldo_vacacional.dias_disponibles = 14-this.saldo_vacacional.dias_tomados;
  
      } else if (diferencia === 3) {
        this.saldo_vacacional.dias_disponibles = 16-this.saldo_vacacional.dias_tomados;
  
      } else if (diferencia === 4) {
        this.saldo_vacacional.dias_disponibles = 18-this.saldo_vacacional.dias_tomados;
      } else if (diferencia === 5) {
        this.saldo_vacacional.dias_disponibles = 20-this.saldo_vacacional.dias_tomados;
      } else if (diferencia >= 6 || diferencia <= 10) {
        this.saldo_vacacional.dias_disponibles = 22-this.saldo_vacacional.dias_tomados;
      } else if (diferencia >= 11 || diferencia <= 15) {
        this.saldo_vacacional.dias_disponibles = 24-this.saldo_vacacional.dias_tomados;
      } else if (diferencia >= 16 || diferencia <= 20) {
        this.saldo_vacacional.dias_disponibles = 26-this.saldo_vacacional.dias_tomados;
      } else if (diferencia >= 21 || diferencia <= 25) {
        this.saldo_vacacional.dias_disponibles = 28-this.saldo_vacacional.dias_tomados;
      } else if (diferencia >= 26 || diferencia <= 30) {
        this.saldo_vacacional.dias_disponibles = 30-this.saldo_vacacional.dias_tomados;
      } else if (diferencia >= 31 || diferencia <= 35) {
        this.saldo_vacacional.dias_disponibles = 32-this.saldo_vacacional.dias_tomados;
      }
      console.log('saldo vacacional',this.saldo_vacacional);
      
         
      this.adminService.createSaldoVacacional(this.saldo_vacacional)
      .subscribe({
        next: (res: SaldoVacacional)=> {
          if(res){
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El Empleado ha sido guardado con éxito',
          });
          setTimeout(() =>{
            this.router.navigate([`/admin/trabajadores`]);
         }, 2000);
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
      this.trabajador_formulario.get('nombre')?.errors?.['required'] &&
      this.trabajador_formulario.get('nombre')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    } else if (this.trabajador_formulario.get('nombre')?.errors?.['pattern']) {
      console.log('nombre no valido');
      
      this.mensaje = 'El nombre no puede contener números o carácteres especiales';
    } else if (
      this.trabajador_formulario.get('nombre')?.errors?.['notOnlyWhitespace'] &&
      this.trabajador_formulario.get('nombre')?.touched
    ) {
      this.mensaje = 'El nombre no puede consistir solo en espacios en blanco.';
    }
    else if (
      this.trabajador_formulario.get('nombre')?.errors?.['minlength']
    ) {
      this.mensaje = 'El nombre debe tener al menos 3 letras';
    }
    return this.mensaje;
  }

  get apellidosNoValidos(){
    this.mensaje='';
    if( this.trabajador_formulario.get('apellidos')?.errors?.['required'] && this.trabajador_formulario.get('apellidos')?.touched){
      this.mensaje= "El campo no puede estar vacío";
    }
    else if(this.trabajador_formulario.get('apellidos')?.errors?.['pattern']){
      this.mensaje= "El/Los apellidos no pueden contener números o carácteres especiales";
    }
    else if(this.trabajador_formulario.get('apellidos')?.errors?.['notOnlyWhitespace'] && this.trabajador_formulario.get('apellidos')?.touched) {
      this.mensaje= "El campo no puede consistir sólo en espacios en blanco.";
    }
    else if(this.trabajador_formulario.get('apellidos')?.errors?.['minlength']) {
      this.mensaje= "Los apellidos debe contener al menos 3 letras";
    }
    return this.mensaje
  }

  get nombreUsuarioNoValido(){
    this.mensaje='';
    if( this.trabajador_formulario.get('nombre_usuario')?.errors?.['required'] && this.trabajador_formulario.get('nombre_usuario')?.touched){
      this.mensaje = "El campo no puede estar vacío";
    } 
    else if( this.trabajador_formulario.get('nombre_usuario')?.errors?.['notOnlyWhitespace'] && this.trabajador_formulario.get('nombre_usuario')?.touched){
      this.mensaje = "El campo no puede consistir sólo en espacios en blanco"
    }
    else if(this.trabajador_formulario.get('nombre_usuario')?.errors?.['minlength']) {
      this.mensaje= "El nombre de usuario debe contener al menos 3 letras";
    }
    return this.mensaje
  }

  get correoNoValido() {
    this.mensaje='';
    if (
      this.trabajador_formulario.get('correo')?.errors?.['required'] &&
      this.trabajador_formulario.get('correo')?.touched
    ) {
      this.mensaje = 'El campo no puede estar vacío';
    } else if (this.trabajador_formulario.get('correo')?.errors?.['pattern']) {
      this.mensaje = 'Ingrese un formato de correo válido';
    }
    return this.mensaje;
  }

  get departamentoNoValido(){
    if(this.trabajador_formulario.get('departamento')?.invalid && this.trabajador_formulario.get('departamento')?.touched){
     this.mensaje = 'El campo no puede estar vacío';
    }
    return this.mensaje;
  }

  get generoNoValido(){
    this.mensaje='';
    if(this.trabajador_formulario.get('genero')?.invalid && this.trabajador_formulario.get('genero')?.touched){
      this.mensaje = "El campo no puede estar vacío";
    }
    return this.mensaje;
  }

  get rolNoValido(){
    this.mensaje='';
    if(this.trabajador_formulario.get('rol')?.invalid && this.trabajador_formulario.get('rol')?.touched){
      this.mensaje = "El campo no puede estar vacío";
    }
    return this.mensaje;
  }

  get fechaNoValida(){
    this.mensaje;
    if (this.trabajador_formulario.get('fecha_contratacion')?.invalid && this.trabajador_formulario.get('fecha_contratacion')?.touched){
      this.mensaje = "El campo no puede estar vacío"
    }
    return this.mensaje;
  }

  get contraseniaNoValido() {
    return (
      this.trabajador_formulario.get('contraseña')?.invalid &&
      this.trabajador_formulario.get('contraseña')?.touched
    );
  }
  get confirmarContraseniaNoValida() {
    const pass1 = this.trabajador_formulario.get('contraseña')?.value;
    const pass2 = this.trabajador_formulario.get('confirmar_contraseña')?.value;

    return pass1.localeCompare(pass2, undefined, { sensitivity: 'case' }) === 0
      ? false
      : true;
  }

}
