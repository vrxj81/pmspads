export interface IContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  url?: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}