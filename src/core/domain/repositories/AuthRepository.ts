import { User } from '../entities/User';
import { LoginParams, RegisterParams } from '../../../types/auth';

export interface AuthRepository {
  login(params: LoginParams): Promise<User>;
  register(params: RegisterParams): Promise<User>;
  logout(): void;
  getCurrentUser(): User | null;
}
