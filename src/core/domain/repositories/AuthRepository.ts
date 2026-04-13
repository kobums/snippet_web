import { User } from '../entities/User';
import { LoginParams, RegisterParams, SendCodeParams } from '../../../types/auth';

export interface AuthRepository {
  login(params: LoginParams): Promise<User>;
  register(params: RegisterParams): Promise<User>;
  sendEmailCode(params: SendCodeParams): Promise<void>;
  logout(): void;
  getCurrentUser(): User | null;
  deleteAccount(): Promise<void>;
}
