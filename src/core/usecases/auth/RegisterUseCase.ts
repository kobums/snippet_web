import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { RegisterParams } from '../../../types/auth';
import { User } from '../../domain/entities/User';

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(params: RegisterParams): Promise<User> {
    return this.authRepository.register(params);
  }
}
