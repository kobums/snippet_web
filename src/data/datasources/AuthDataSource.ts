import { LoginParams, RegisterParams, SendCodeParams, VerifyCodeParams } from '../../types/auth';
import { User } from '../../core/domain/entities/User';
import api from '../../lib/api';

export class AuthDataSource {
  async register(params: RegisterParams): Promise<User> {
    const { data } = await api.post<User>('/auth/register', params);
    return data;
  }

  async login(params: LoginParams): Promise<User> {
    const { data } = await api.post<User>('/auth/login', params);
    return data;
  }

  async sendEmailCode(params: SendCodeParams): Promise<void> {
    await api.post('/auth/emailcode', params);
  }

  async verifyCode(params: VerifyCodeParams): Promise<User> {
    const { data } = await api.post<User>('/auth/verifycode', params);
    return data;
  }

  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  }

  async deleteAccount(): Promise<void> {
    await api.delete('/auth/account');
  }
}
