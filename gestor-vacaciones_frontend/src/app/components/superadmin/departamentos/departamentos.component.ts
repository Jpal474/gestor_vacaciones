import { Component, OnInit } from '@angular/core';
import { Departamento } from 'src/app/interfaces/departamento.interface';
import { Empresa } from 'src/app/interfaces/empresa.interface';
import { SuperadService } from 'src/app/services/superad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {
  departamentos: Departamento[] = [];
  departamento: Departamento = {
    nombre: '',
    empresa:{
      id:1,
      nombre: '',
      direccion: '',
      telefono: '',
      correo: '',
    }
  };

  constructor(private superadService: SuperadService) {}

  ngOnInit(): void {
    this.getDepartamentos();
  }

  async guardarDepartamento() {
    const specialCharactersRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const { value: departamento } = await Swal.fire({//ingresa el nombre del departamento
      title: 'Ingrese Departamento',
      input: 'text',
      inputLabel: 'Nombre',
      inputPlaceholder: 'Ingrese Nombre del Departamento',
    });
    if(departamento && !(specialCharactersRegex.test(departamento))){//verifica si existe un dea
      let result=true
      console.log('this.departamentos',this.departamentos);
      
      if(this.departamentos.length !==0 ){
        console.log('antes de for');
      for (let i = 0; i < this.departamentos.length; i++) {
        console.log('entra al for');
        
        if(departamento.toLowerCase() === this.departamentos[i].nombre){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No puedes registrar dos Departamentos con el mismo nombre',
          })
          result=false;
          break;
        } 
        }
        if(result){
          this.superadService.getEmpresa()
          .subscribe({
            next: (res:Empresa)=> {
              this.departamento.empresa=res;
              this.departamento.nombre=departamento.toLowerCase();
              this.superadService.createDepartamento(this.departamento)
              .subscribe({
                next: (res: Departamento)=> {
                  Swal.fire(`Departamento Registrado: ${departamento}`)
                  setTimeout(function(){
                    window.location.reload();
                 }, 2000); //recargo la página después de 2 segundos
                }
              })
            }
          })
        }
    }
  }}


  getDepartamentos(){
    this.superadService.getDepartamentos()
    .subscribe({
      next: (res:Departamento[])=> {
        this.departamentos=res        
      },
      error: (e: string)=> {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: e,
        })
      }
    })
  }

  borrarDepartamento(id: string | undefined){
    if(id){
   const departamento_id = parseInt(id);
   this.superadService.deleteDepartamento(departamento_id)
   .subscribe({
    next: (res: Boolean)=>{
      if(res){
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'El departamento ha sido borrado con éxito',
      })  
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha podido eliminar el departamento',
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
  }
}
