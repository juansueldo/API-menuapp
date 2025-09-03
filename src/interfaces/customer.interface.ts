export interface ICustomer {
  id: number;
  name: string;
  domain?: string;
  theme?: object;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}