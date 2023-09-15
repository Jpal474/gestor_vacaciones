import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css']
})
export class DepartamentosComponent {

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

}
