export interface GymType {
  Id: string;
  Name: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Ip: string | null;
  IsActive: boolean;
  Gyms: any[];
}
