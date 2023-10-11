import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recuperar-contrasenia',
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.css']
})
export class RecuperarContraseniaComponent {
  mail_formulario!: FormGroup
  destinatario: string ='';
  constructor(
    private authService : AuthService,
    private fb : FormBuilder,
    private router: Router
    ){
      this.crearFormulario();
    }

 ngOnInit(): void {
   this.enviarMail();
   this.crearFormulario();
 }
  crearFormulario(){
    this.mail_formulario=this.fb.group({
      correo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/), this.notOnlyWhitespace]],
    })
    }
  
   enviarMail(){
    if (!this.mail_formulario.invalid){
      this.destinatario = this.mail_formulario.value['correo']
  this.authService.enviarMail(this.destinatario)
  .subscribe({
    next: (res: boolean)=>{
      console.log('correo enviado');
    },
    error: (err)=>{
      console.log(`correo no enviado: ${err}`);
      
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
}
