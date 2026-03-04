import { AuthRepository } from '../../core/domain/repositories/AuthRepository';
import { AuthDataSource } from '../datasources/AuthDataSource';
import { LoginParams, RegisterParams } from '../../types/auth';
import { User } from '../../core/domain/entities/User';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private authDataSource: AuthDataSource) {}

  async login(params: LoginParams): Promise<User> {
    const user = await this.authDataSource.login(params);
    if (user.token) {
      this.saveToken(user.token);
      this.saveCurrentUser(user);
    }
    return user;
  }

  async register(params: RegisterParams): Promise<User> {
    const user = await this.authDataSource.register(params);
    return user;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  }

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  private saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  private saveCurrentUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }
}
