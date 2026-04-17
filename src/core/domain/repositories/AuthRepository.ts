import { User } from '../entities/User';
import { LoginParams, RegisterParams, SendCodeParams, VerifyCodeParams } from '../../../types/auth';

export interface AuthRepository {
  login(params: LoginParams): Promise<User>;
  register(params: RegisterParams): Promise<User>;
  sendEmailCode(params: SendCodeParams): Promise<void>;
  verifyCode(params: VerifyCodeParams): Promise<User>;
  logout(): void;
  getCurrentUser(): User | null;
  deleteAccount(): Promise<void>;
}
