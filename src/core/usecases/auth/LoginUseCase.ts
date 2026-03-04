import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { LoginParams } from '../../../types/auth';
import { User } from '../../domain/entities/User';

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(params: LoginParams): Promise<User> {
    return this.authRepository.login(params);
  }
}
