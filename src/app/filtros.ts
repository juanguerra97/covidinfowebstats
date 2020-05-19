import { CasoCovid } from './CasoCovid';

export function filtrarPorPais(casos: CasoCovid[], pais: string): CasoCovid[] {
  return casos.filter(c => c.pais === pais);
}

export function filtrarPorDepartamento(casos: CasoCovid[], departamento: string): CasoCovid[] {
  return casos.filter(c => c.departamento === departamento);
}

export function filtrarPorMunicipio(casos: CasoCovid[], municipio: string): CasoCovid[] {
  return casos.filter(c => c.municipio === municipio);
}

export function filtrarPorEdad(casos: CasoCovid[], edad: number, edadFin: number = edad): CasoCovid[] {
  return casos.filter(c => c.edad >= edad && c.edad <= edadFin);
}

export function filtrarPorSexo(casos: CasoCovid[], sexo: string): CasoCovid[] {
  return casos.filter(c => c.sexo === sexo);
}

export function filtrarPorFecha(casos: CasoCovid[], fecha: string): CasoCovid[] {
  return casos.filter(c => c.fecha === fecha);
}

export function filtrarCasos(casos: CasoCovid[], pais: string,
                             departamento: string, municipio: string, sexo: string,
                             fecha: string, edad: number, edadFin: number = edad): CasoCovid[] {
  let casosCovid: CasoCovid[] = casos;
  if (pais != null) {
    casosCovid = filtrarPorPais(casosCovid, pais);
  }
  if (departamento != null) {
    casosCovid = filtrarPorDepartamento(casosCovid, departamento);
  }
  if (municipio != null) {
    casosCovid = filtrarPorMunicipio(casosCovid, municipio);
  }
  if (sexo != null) {
    casosCovid = filtrarPorSexo(casosCovid, sexo);
  }
  if (fecha != null) {
    casosCovid = filtrarPorFecha(casosCovid, fecha);
  }
  if (edad != null) {
    casosCovid = filtrarPorEdad(casosCovid, edad, edadFin);
  }
  return casosCovid;
}
