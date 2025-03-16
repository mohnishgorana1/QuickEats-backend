export type UserRole = "admin" | "customer" | "rider" | "restaurant_owner";

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  refreshToken?: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}
