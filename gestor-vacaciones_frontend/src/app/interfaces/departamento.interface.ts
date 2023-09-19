import { Empresa } from "./empresa.interface";

export interface Departamento{
    id?:string,
    nombre: string,
    empresa?: Empresa
}