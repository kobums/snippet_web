import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { RegisterParams, RegisterResponse } from '../../../types/auth';

export class RegisterUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(params: RegisterParams): Promise<RegisterResponse> {
    return this.authRepository.register(params);
  }
}
