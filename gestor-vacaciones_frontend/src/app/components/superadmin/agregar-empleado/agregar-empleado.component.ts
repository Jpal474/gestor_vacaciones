import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Departamento } from 'src/app/interfaces/departamento.interface';
import { Empleado, EmpleadoGenero } from 'src/app/interfaces/empleados.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { SuperadService } from 'src/app/services/superad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-empleado',
  templateUrl: './agregar-empleado.component.html',
  styleUrls: ['./agregar-empleado.component.css']
})
export class AgregarEmpleadoComponent implements OnInit{
  mensaje='';
  empleado_formulario!: FormGroup;
  departamentos: Departamento[]= [];
  usuario: Usuario={
    nombre_usuario: '',
    correo: '',
    contraseña:'',
    }
  empleado: Empleado={
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
    private fb: FormBuilder,
    private superadService: SuperadService,
    private router: Router
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
  rol:['', Validators.required],
  fecha_contratacion: ['', [Validators.required, this.maxDateValidator]],
  contraseña: ['', [Validators.required, this.notOnlyWhitespace]],
  confirmar_contraseña: ['', [Validators.required, this.notOnlyWhitespace]],
})
  }

  ngOnInit(): void {
    this.getDepartamentos();
    
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

  guardarEmpleado(){

    if (!this.empleado_formulario.invalid){
      const { confirmar_contraseña: _, ...nuevoEmpleado } =
        this.empleado_formulario.value;
        this.usuario.nombre_usuario = nuevoEmpleado.nombre_usuario;
        this.usuario.correo = nuevoEmpleado.correo;
        this.usuario.contraseña = nuevoEmpleado.contraseña;
        if (this.empleado_formulario.value['rol'] === 2){
          this.usuario.rol = {
            id: 2,
            nombre: 'Administrador'
          };
        }
        else{
          this.usuario.rol = {
            id: 3,
            nombre: 'Trabajador'
          };
        }
        this.superadService.createUsuario(this.usuario)
         .subscribe({
          next: (res:Usuario) => {//subsribe de crear usuario
            this.empleado.usuario = res;
            console.log('empleado despues de usuario', this.empleado);
            this.superadService.getDepartamentoById(this.empleado_formulario.value['departamento'])
            .subscribe({ //subscribe de obtener departamento
              next: (res:Departamento)=> {
                this.empleado.departamento=res;
                this.empleado.nombre = nuevoEmpleado.nombre;
                this.empleado.apellidos = nuevoEmpleado.apellidos;
                this.empleado.genero = nuevoEmpleado.genero;
                this.empleado.fecha_contratacion = nuevoEmpleado.fecha_contratacion.toString();
                if(this.empleado_formulario.value['rol'] === '2'){
                  this.superadService.createAdministrador(this.empleado)
                  .subscribe({
                    next: (res: Empleado)=> {
                      Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'El Administrador ha sido guardado con éxito',
                      })  
                      
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
                  this.superadService.createTrabajador(this.empleado)
                  .subscribe({
                    next: (res: Empleado)=> {
                      console.log(res);  
                    },
                    error(err) {
                      console.log(err);
                      
                    },
                  })
                }

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

  get rolNoValido(){
    this.mensaje='';
    if(this.empleado_formulario.get('rol')?.invalid && this.empleado_formulario.get('rol')?.touched){
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
