import { Component, OnInit } from '@angular/core';
import { Empleado, EmpleadoEstado } from 'src/app/interfaces/empleados.interface';
import { SaldoVacacional } from 'src/app/interfaces/saldo_vacacional.interface';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.css']
})
export class TrabajadoresComponent implements OnInit{
  trabajadores: Empleado[] = [];
  paginasArray: number[]=[];
  paginas = 0;
  pagina_actual =0;
  saldo = {} as SaldoVacacional
  limite = 100;
  specialCharactersRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  anio = new Date().getFullYear();


  constructor(
    private adminService: AdminService) {}

  ngOnInit(): void {
    this.getTrabajadores(1);
  }

  getTrabajadores(page: number) {
    this.pagina_actual = page
    this.adminService.getTrabajadores(5, page).subscribe({
      next: (res: { trabajadores: Empleado[]; pages: number }) => {
        this.trabajadores = res.trabajadores;  
        this.paginas = res.pages;  
        this.paginasArray = Array.from({ length: this.paginas }, (_, index) => index + 1);
      },
      error: (err)=>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha habido un error al procesar la solicitud',
          confirmButtonColor:'#198754'
        }),
        console.log(err);
        
      }
    });
  }

  eliminarTrabajador(id: string | undefined){
    if(id){
    this.adminService.deleteUsuario(id)
    .subscribe({
      next: (res: boolean)=> {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El Trabajador ha sido eliminado con éxito',
          confirmButtonColor: ''
        }),
        setTimeout(function(){
          window.location.reload();
       }, 2000);
      },
      error: (err)=> {
        const cadena:string = 'Unknown Error'
        if(err.includes(cadena)){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha habido un error al completar la solicitud',
            confirmButtonColor:'#198754'
          })
        }
        else if('unauthorized'.includes(err)){
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debe iniciar sesión para completar la acción',
            confirmButtonColor:'#198754'
          })
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha habido un error al eliminar al trabajador',
          confirmButtonColor:'#198754'
        }),
        console.log(err);
        
        setTimeout(function(){
          window.location.reload();
       }, 2000); 
      }
    })
  }
}

cambiarEstado(id:string | undefined, estado: EmpleadoEstado | undefined){
  let opcion = 1
  if(estado === 'DE VACACIONES')
  opcion=2;

this.adminService.updateEmpleadoStatus(id!, opcion)
.subscribe({
  next: (res: boolean)=> {
    if (res){
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'El Estado del Trabajador ha sido cambiado con éxito',
        confirmButtonColor: ''
      }),
      setTimeout(function(){
        window.location.reload();
     }, 2000);
    }
  },
  error: (err)=> {
    const cadena:string = 'Unknown Error'
          if(err.includes(cadena)){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ha habido un error al completar la solicitud',
              confirmButtonColor: ''
            })
          }
          else if(err.includes('Unauthorized')){
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Debe iniciar sesión para completar la acción',
              confirmButtonColor:'#198754',
            })
          }
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al cambiar el estado',
            confirmButtonColor:'#198754',
          })
          console.log(err);
          
  },
})
}

async actualizarDias(id: string | undefined){
  const { value: formValues } = await Swal.fire({
    title: 'Elija Una Opción',
    html:
      ` <input type="radio" id="agregar_dias" name="saldo_vacacional"> Agregar Días` +
      '<br>' + //creamos un input para la fecha de inicio
      ' <input type="radio" id="actualizar_dias" name="saldo_vacacional"> Actualizar Días', //label para cantidad de dias

        //en el input de arriba se valida que se ingrese un numero de 2 digitos o menos
      focusConfirm: false,
    preConfirm: () => {
      const input1 = document.getElementById(
        'agregar_dias'
      ) as HTMLInputElement;
      const input2 = document.getElementById(
        'actualizar_dias'
      ) as HTMLInputElement;

      console.log(input1.value);
      

      if (input1.checked) {
         this.agregarDias(id, 1)
         return;
      }
      else if (input2.checked){    
        this.agregarDias(id, 2);
        return;
      }
      else {
        // Handle the case where one or both elements are not found in the DOM
        // Return an array with default or error values
        return []; //retornamos un array vacío en caso de que no se agreguen valores
      }

    },
    confirmButtonColor:'#198754'
  });
}

async agregarDias(id: string | undefined, opcion: number){
  let texto = '';
  if(opcion === 1)
    texto = 'Ingrese Días Adicionales para su Empleado'
  else
  texto = 'Ingrese los Días de Vacaciones de su Empleado'

  


  const { value: dias } = await Swal.fire({//ingresa el nombre del departamento
    title: texto,
    input: 'text',
    inputLabel: 'Días Adicionales',
    inputPlaceholder: 'Número Días',
    confirmButtonColor:'#198754',
    showCancelButton:true,
    cancelButtonColor:'#8c0b0a',
    cancelButtonText:'Cancelar',
  });

  if(dias && !(this.specialCharactersRegex.test(dias)) && dias < this.limite){
    let i =0;
    this.trabajadores.forEach(trabajador => {
      if(trabajador.id && trabajador.id === id){
        this.saldo.dias_disponibles = trabajador.saldo_vacacional?.[i]?.dias_disponibles!
        this.saldo.dias_tomados = trabajador.saldo_vacacional?.[i]?.dias_tomados!
      }
    });

    if(opcion === 1)
    this.saldo.dias_disponibles += parseInt(dias);
    else if (opcion === 2)
    this.saldo.dias_disponibles = parseInt(dias)

   this.adminService.updateSaldoVacacional(id!, this.anio, this.saldo)
   .subscribe({
    next: (res:SaldoVacacional)=> {
      if (res){
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El Saldo Vacacional ha sido actualizado',
          confirmButtonColor: '#198754'
        });
      }
      setTimeout(function(){
        window.location.reload();
     }, 2000);
    },
    error: error=> error,
   })
  }
}



}
