import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { SendCodeParams } from '../../../types/auth';

export class SendVerificationCodeUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(params: SendCodeParams): Promise<void> {
    return this.authRepository.sendVerificationCode(params);
  }
}
