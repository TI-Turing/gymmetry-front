/**
 * Tipos para entidades comunes del sistema
 */

export interface Gender {
  Id: string;
  Nombre: string;
}

export interface Country {
  Id: string;
  Nombre: string;
}

export interface Region {
  Id: string;
  Nombre: string;
  PaisId: string;
}

export interface City {
  Id: string;
  Nombre: string;
  RegionId: string;
}

export interface DocumentType {
  Id: string;
  Nombre: string;
  Abreviatura: string;
  PaisId: string;
}

export interface EPS {
  Id: string;
  Nombre: string;
}
