"use client";

import React, { useState } from 'react';
import styled from '@emotion/styled';
import { LoginUseCase } from '../../core/usecases/auth/LoginUseCase';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { AuthDataSource } from '../../data/datasources/AuthDataSource';
import { useRouter } from 'next/navigation';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 32px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  color: #333333;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #4a90e2;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;

  &:hover {
    background-color: #357abd;
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
`;

// Simple DI setup for component use
const authDataSource = new AuthDataSource();
const authRepository = new AuthRepositoryImpl(authDataSource);
const loginUseCase = new LoginUseCase(authRepository);

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginUseCase.execute({ email, password });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <Container>
      <Title>로그인</Title>
      <Form onSubmit={handleSubmit}>
        <Input 
          type="email" 
          placeholder="이메일" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <Input 
          type="password" 
          placeholder="비밀번호" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit">로그인</Button>
      </Form>
    </Container>
  );
};
