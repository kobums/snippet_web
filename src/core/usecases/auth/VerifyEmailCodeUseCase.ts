import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { VerifyCodeParams } from '../../../types/auth';
import { User } from '../../domain/entities/User';

export class VerifyEmailCodeUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(params: VerifyCodeParams): Promise<User> {
    return this.authRepository.verifyCode(params);
  }
}
