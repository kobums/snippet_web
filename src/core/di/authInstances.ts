import { AuthDataSource } from '@/data/datasources/AuthDataSource';
import { AuthRepositoryImpl } from '@/data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '@/core/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '@/core/usecases/auth/RegisterUseCase';
import { DeleteAccountUseCase } from '@/core/usecases/auth/DeleteAccountUseCase';
import { SendVerificationCodeUseCase } from '@/core/usecases/auth/SendVerificationCodeUseCase';
import { VerifyEmailCodeUseCase } from '@/core/usecases/auth/VerifyEmailCodeUseCase';

const authDataSource = new AuthDataSource();
const authRepository = new AuthRepositoryImpl(authDataSource);

export const loginUseCase = new LoginUseCase(authRepository);
export const registerUseCase = new RegisterUseCase(authRepository);
export const deleteAccountUseCase = new DeleteAccountUseCase(authRepository);
export const sendVerificationCodeUseCase = new SendVerificationCodeUseCase(authRepository);
export const verifyEmailCodeUseCase = new VerifyEmailCodeUseCase(authRepository);
