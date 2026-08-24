import { AuthRepository } from '../../core/domain/repositories/AuthRepository';
import { AuthDataSource } from '../datasources/AuthDataSource';
import { LoginParams, RegisterParams, SendCodeParams, VerifyCodeParams } from '../../types/auth';
import { User } from '../../core/domain/entities/User';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private authDataSource: AuthDataSource) {}

  async login(params: LoginParams): Promise<User> {
    const user = await this.authDataSource.login(params);
    if (user.token) {
      this.saveToken(user.token);
      this.saveCurrentUser(user);
    }
    this.replaceRefreshToken(user.refreshToken);
    return user;
  }

  async register(params: RegisterParams): Promise<User> {
    const user = await this.authDataSource.register(params);
    if (user.token) {
      this.saveToken(user.token);
      this.saveCurrentUser(user);
    }
    this.replaceRefreshToken(user.refreshToken);
    return user;
  }

  async sendEmailCode(params: SendCodeParams): Promise<void> {
    await this.authDataSource.sendEmailCode(params);
  }

  async verifyCode(params: VerifyCodeParams): Promise<User> {
    return this.authDataSource.verifyCode(params);
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
    }
  }

  async getMe(): Promise<User> {
    const user = await this.authDataSource.getMe();
    this.saveCurrentUser(user);
    return user;
  }

  async deleteAccount(): Promise<void> {
    await this.authDataSource.deleteAccount();
    this.logout();
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

  /**
   * 새 세션의 refresh 토큰으로 교체. 응답에 없으면 이전 계정 것을 지운다.
   * 남겨두면 401 → refresh가 이전 계정으로 되살아나 화면은 새 계정,
   * 쓰기는 이전 계정으로 나가는 교차 오염이 생긴다.
   */
  private replaceRefreshToken(token?: string | null): void {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('refreshToken', token);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }

  private saveCurrentUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }
}
