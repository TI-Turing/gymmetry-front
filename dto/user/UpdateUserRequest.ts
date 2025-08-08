export interface UpdateUserRequest {
  id: string;
  idEps?: string;
  name?: string;
  lastName?: string;
  userName?: string;
  idGender?: string;
  birthDate?: string;
  documentTypeId?: string;
  phone?: string;
  countryId?: string;
  address?: string;
  cityId?: string;
  regionId?: string;
  rh?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  physicalExceptions?: string;
  userTypeId?: string;
  physicalExceptionsNotes?: string;
}
