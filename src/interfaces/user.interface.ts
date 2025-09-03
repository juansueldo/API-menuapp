export interface IUser {
  id: number;
  email: string;
  password: string;
  role: string;
  customerId: number;
  createdAt: Date;
  updatedAt: Date;
}