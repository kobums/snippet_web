import { AuthDataSource } from '@/data/datasources/AuthDataSource';
import { AuthRepositoryImpl } from '@/data/repositories/AuthRepositoryImpl';
import { LoginUseCase } from '@/core/usecases/auth/LoginUseCase';
import { RegisterUseCase } from '@/core/usecases/auth/RegisterUseCase';

const authDataSource = new AuthDataSource();
const authRepository = new AuthRepositoryImpl(authDataSource);

export const loginUseCase = new LoginUseCase(authRepository);
export const registerUseCase = new RegisterUseCase(authRepository);
