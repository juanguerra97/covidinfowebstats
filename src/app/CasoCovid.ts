
export interface CasoCovid {
  pais: string;
  departamento: string;
  municipio: string;
  primerNombre: string;
  segundoNombre?: string | null;
  primerApellido: string;
  segundoApellido?: string | null;
  sexo: string;
  edad: number;
  fecha: string;
}
