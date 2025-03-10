import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import BetCard from '../components/bets/BetCard';
import BetForm from '../components/bets/BetForm';
import { getAllBets } from '../utils/betsService';

const HomePage = () => {
  const [bets, setBets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load all bets
    const fetchBets = () => {
      const betsData = getAllBets();
      setBets(betsData);
    };

    fetchBets();
  }, []);

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Suas apostas</h1>
        <Button
          color="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Esconder' : 'Criar nova aposta'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-4">
          <BetForm />
        </div>
      )}

      {bets.length === 0 ? (
        <Alert color="info">
          Você não tem apostas. Crie sua primeira aposta!
        </Alert>
      ) : (
        <Row>
          {bets.map(bet => (
            <Col key={bet.id} md={4} className="mb-4">
              <BetCard bet={bet} />
            </Col>
          ))}
        </Row>
      )}
    </Layout>
  );
};

export default HomePage;