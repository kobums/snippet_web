"use client";

import styled from '@emotion/styled';
import { LoginForm } from '../../components/auth/LoginForm';
import Link from 'next/link';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666666;
`;

const FooterLink = styled.div`
  margin-top: 24px;
  font-size: 14px;
  color: #666666;

  a {
    color: #4a90e2;
    text-decoration: none;
    font-weight: 600;
    margin-left: 8px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function LoginPage() {
  return (
    <PageContainer>
      <Header>
        <Title>Snippet</Title>
        <Subtitle>기록하고 싶은 모든 순간</Subtitle>
      </Header>
      
      <LoginForm />

      <FooterLink>
        계정이 없으신가요? 
        <Link href="/register">회원가입</Link>
      </FooterLink>
    </PageContainer>
  );
}
