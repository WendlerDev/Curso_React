import React from 'react';
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="display-1">404</h1>
        <h2 className="mb-4">Página não encontrada</h2>

        <Alert color="warning" className="mb-4">
          Página que você procura não foi encontrada.
        </Alert>

        <Button color="primary" tag={Link} to="/home">
          Voltar para a home
        </Button>
      </div>
    </Layout>
  );
};

export default NotFoundPage;