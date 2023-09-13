import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css'],
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

    // if (
    //   departamento &&
    //   localStorage.getItem('id_supermercado') !== null &&
    //   !specialCharactersRegex.test(departamento)
    // ) {
    //   console.log('entra al if para departamento');

    //   let result = true;
    //   console.log('this.departamentos', this.departamentos);

    //   if (this.departamentos.length !== 0) {
    //     console.log('antes de for');
    //     for (let i = 0; i < this.departamentos.length; i++) {
    //       console.log('entra al for');

    //       if (departamento.toLowerCase() === this.departamentos[i].nombre) {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Error',
    //           text: 'No puedes registrar dos Departamentos con el mismo nombre',
    //         });
    //         result = false;
    //         break;
    //       }
    //     }
    //   }
    // }
  }
}
