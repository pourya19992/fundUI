export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  role?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
} 