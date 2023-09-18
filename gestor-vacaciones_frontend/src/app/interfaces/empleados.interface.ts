import { Departamento } from "./departamento.interface";
import { Usuario } from "./usuario.interface";

export interface Empleado{
    nombre: string,
    apellidos: string,
    genero: EmpleadoGenero;
    fecha_contratacion: string,
    usuario: Usuario,
    departamento: Departamento,
}

export enum EmpleadoGenero{
    FEMENINO='FEMENINO',
    MASCULINO='MASCULINO',
    OTRO='OTRO'
}