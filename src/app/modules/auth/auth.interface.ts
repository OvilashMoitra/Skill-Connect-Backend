export type IAuthRole = 'super_admin' | 'project_manager' | 'developer';

export type IAuth = {
  email: string;
  password?: string;
  role: IAuthRole;
  paid: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
