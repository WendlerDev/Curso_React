import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';
import { isAuthenticated } from '../utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="text-center mb-4">
        <h1>Bem vindo ao BetTracker</h1>
        <p className="lead">Aplicativo para rastreamento de apostas pessoais</p>
      </div>

      <LoginForm />
    </Layout>
  );
};

export default LoginPage;