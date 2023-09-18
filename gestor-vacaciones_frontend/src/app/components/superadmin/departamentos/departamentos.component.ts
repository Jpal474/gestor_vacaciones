import { Component, OnInit } from '@angular/core';
import { Departamento } from 'src/app/interfaces/departamento.interface';
import { SuperadService } from 'src/app/services/superad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent implements OnInit {
  departamentos: Departamento[] = [];

  constructor(private superadService: SuperadService) {}

  ngOnInit(): void {
    this.getDepartamentos();
  }

  async guardarDepartamento() {
    const specialCharactersRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const { value: departamento } = await Swal.fire({
      title: 'Ingrese Departamento',
      input: 'text',
      inputLabel: 'Nombre',
      inputPlaceholder: 'Ingrese Nombre del Departamento',
    });
    console.log('antes de if para departamento y localstorage');
  }


  getDepartamentos(){
    this.superadService.getDepartamentos()
    .subscribe({
      next: (res:Departamento[])=> {
        this.departamentos=res        
      },
      error: (e)=> {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: e,
        })
      }
    })
  }
}
