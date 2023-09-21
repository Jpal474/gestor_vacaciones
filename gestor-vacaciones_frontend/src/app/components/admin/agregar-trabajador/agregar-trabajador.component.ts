import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Departamento } from 'src/app/interfaces/departamento.interface';
import { Empleado, EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

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
                          console.log(res);  
                        },
                        error(err) {
                          console.log(err);
                          
                        },
                      })
                  },
                  error(err) {                
                    console.log(err);  
                  },
                })//cierre subscribe de obtener departamento 
              },
              error(err) {
                console.log('--usuario--');
                console.log(err);      
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
