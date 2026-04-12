import { LoginParams, RegisterParams, RegisterResponse, SendCodeParams, VerifyCodeParams } from '../../types/auth';
import { User } from '../../core/domain/entities/User';
import api from '../../lib/api';

export class AuthDataSource {
  async register(params: RegisterParams): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>('/auth/register', params);
    return data;
  }

  async login(params: LoginParams): Promise<User> {
    const { data } = await api.post<User>('/auth/login', params);
    return data;
  }

  async sendVerificationCode(params: SendCodeParams): Promise<void> {
    await api.post('/auth/sendcode', params);
  }

  async verifyCode(params: VerifyCodeParams): Promise<User> {
    const { data } = await api.post<User>('/auth/verifycode', params);
    return data;
  }

  async deleteAccount(): Promise<void> {
    await api.delete('/auth/account');
  }
}
