// Interfaces para las respuestas de usuario

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  eps?: string;
  country?: string;
  region?: string;
  city?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
  fitnessGoal?: string;
  healthRestrictions?: string;
  additionalInfo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserResponse {
  Success: boolean;
  Message: string;
  Data: {
    Id: string;
    Token: string;
  };
  StatusCode: number;
}

// Mantener la interfaz anterior para compatibilidad (deprecated)
export interface CreateUserResponseOld {
  userId: number;
  email: string;
  token?: string;
  message?: string;
}

export interface UpdateUserResponse {
  Success: boolean;
  Message: string;
  Data: {
    id: number;
    idEps?: number;
    name?: string;
    lastName?: string;
    userName?: string;
    idGender?: number;
    birthDate?: string;
    documentTypeId?: number;
    documentType?: string;
    phone?: string;
    countryId?: number;
    address?: string;
    cityId?: number;
    regionId?: number;
    rh?: string;
    emergencyName?: string;
    emergencyPhone?: string;
    physicalExceptions?: string;
    isActive?: boolean;
    userTypeId?: number;
  };
  StatusCode: number;
}
