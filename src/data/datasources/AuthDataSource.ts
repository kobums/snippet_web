import { LoginParams, RegisterParams } from '../../types/auth';
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

  async deleteAccount(): Promise<void> {
    await api.delete('/auth/account');
  }
}
