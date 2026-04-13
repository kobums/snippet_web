export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  name: string;
  code: string;
}

export interface RegisterResponse {
  email: string;
  message: string;
}

export interface SendCodeParams {
  email: string;
}

export interface VerifyCodeParams {
  email: string;
  code: string;
}
