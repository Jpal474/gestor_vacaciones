import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { Login } from 'src/app/interfaces/login.interface';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login_formulario!: FormGroup;
  usuarioNotFound!:string
  passwordInvalid!:string
  constructor(private fb: FormBuilder, private authService: AuthService, private router:Router, private adminService:AdminService) {
  }

  ngOnInit(): void {
    this.crearFormulario();
  }
  crearFormulario() {
    this.login_formulario = this.fb.group({
      correo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), this.notOnlyWhitespace]],
      contraseña: ['', [Validators.required, this.notOnlyWhitespace]],
    });
  }

  login(){
    console.log('entra');
    
    this.authService.getAuth(this.login_formulario.value.correo, this.login_formulario.value.contraseña)
    .subscribe({
      next: (login: Login) => {
        console.log(login);
        
        this.usuarioNotFound = '';
        this.passwordInvalid = '';
        const tokenCodificado = btoa(JSON.stringify(login.accessToken))
        localStorage.setItem('token', tokenCodificado);
        const empleado = this.authService.decodeUserFromToken(login.accessToken);
        console.log('empleado',empleado);
        localStorage.setItem('usuario', btoa(JSON.stringify(empleado.nombre)));
        localStorage.setItem('id', btoa(JSON.stringify(empleado.id)));
        localStorage.setItem('tipo', btoa(JSON.stringify(empleado.rol)));
        localStorage.setItem('correo', btoa(JSON.stringify(empleado.correo)));
        if(empleado.rol === 'SuperAdministrador'){
          this.router.navigate(['/super/inicio']);
        }
        else if(empleado.rol === 'Administrador'){
          this.router.navigate(['/admin/inicio']);
        }
        else if(empleado.rol === 'Trabajador'){
          this.router.navigate(['/trabajador/inicio'])
        }
        console.log('bienvenido', empleado.nombre);
        
        Swal.fire({
          title: `Bienvenido(a) ${empleado.nombre}`,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          customClass: {
            confirmButton: 'btn-sweet'
          }
        })
        
      },
      error: (e)=> {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al iniciar sesion, revise su credenciales y si el error persiste, pongase en contacto con la página',
        })
      }
    })
  }

  notOnlyWhitespace(control: AbstractControl) {
    if (control.value !== null && control.value.trim() === '') {
      return { notOnlyWhitespace: true };
    }
    return null;
  }

  get correoNoValido():string{
    let mensaje="";
    if(this.login_formulario.get('correo')?.errors?.['required'] && this.login_formulario.get('correo')?.touched){
        mensaje="El campo no puede estar vacío"
    }
    else if(this.login_formulario.get('correo')?.errors?.['pattern']){
      mensaje="Ingrese un formato de correo válido"
    }
    else if (
      this.login_formulario.get('correo')?.errors?.['notOnlyWhitespace'] &&
      this.login_formulario.get('correo')?.touched
    ) {
      mensaje = 'El campo no puede consistir solo en espacios en blanco.';
    }
    return mensaje;
          }

  get contraseniaNoValida():string {
    let mensaje="";
    if(this.login_formulario.get('contraseña')?.errors?.['required'] && this.login_formulario.get('contraseña')?.touched){
      mensaje = "El campo no puede estar vacío";
    }
    else if(this.login_formulario.get('contraseña')?.errors?.['notOnlyWhitespace'] &&
    this.login_formulario.get('contraseña')?.touched){
      mensaje = "El campo no puede consistir sólo en espacios en blanco.";
    }
    return mensaje;
  }

}
