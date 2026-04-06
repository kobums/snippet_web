import { AuthRepository } from '@/core/domain/repositories/AuthRepository';

export class DeleteAccountUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.deleteAccount();
  }
}
