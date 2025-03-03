import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoginForm from '../components/auth/LoginForm';
import { isAuthenticated } from '../utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated()) {
      navigate('/home');
    }
  }, [navigate]);
  
  return (
    <Layout>
      <div className="text-center mb-4">
        <h1>Welcome to BetTracker</h1>
        <p className="lead">Log in to track your daily challenges with friends</p>
      </div>
      
      <LoginForm />
    </Layout>
  );
};

export default LoginPage;