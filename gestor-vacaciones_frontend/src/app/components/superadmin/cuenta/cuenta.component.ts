import { Component } from '@angular/core';
import { Ceo } from 'src/app/interfaces/ceo.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { SuperadService } from 'src/app/services/superad.service';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css']
})
export class CuentaComponent {
  ceo = {} as Ceo 
constructor(
  private superadService: SuperadService
) {}

ngOnInit(): void {
  console.log('entra on-init');
  
  const id = JSON.parse(atob(localStorage.getItem('id')!))
  if(id){
  this.getUsuario(id);
}
}

getUsuario(id: string){
  console.log('entra if');
  
  this.superadService.getCeoByUserId(id)
  .subscribe({
    next: (res: Ceo)=>{
      if(res){
        console.log(res);
        
        this.ceo= res;
      }
    },
    error: (err)=>{
      console.log(err);
      
    }
  })
}



}
