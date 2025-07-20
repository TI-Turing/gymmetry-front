// Interfaces para las peticiones de usuario

export interface CreateUserRequest {
  email: string;
  Password: string; // Nota: la API espera "Password" con mayúscula
}

export interface UpdateUserRequest {
  id: string;
  idEps?: string;
  name?: string;
  lastName?: string;
  userName?: string;
  idGender?: string;
  birthDate?: string; // formato: "1990-05-15T00:00:00"
  documentTypeId?: string;
  documentType?: string;
  phone?: string;
  countryId?: string;
  address?: string;
  cityId?: string;
  regionId?: string;
  rh?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  physicalExceptions?: string;
  isActive?: boolean;
  userTypeId?: string;
}
