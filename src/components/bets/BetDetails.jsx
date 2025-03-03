import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardText, Button, Alert, Row, Col } from 'reactstrap';
import { getBetById } from '../../utils/betsService';
import ParticipantForm from './ParticipantForm';
import ParticipantsList from './ParticipantsList';
import DailyCheckIn from './DailyCheckIn';

const BetDetails = () => {
  const { id } = useParams();
  const [bet, setBet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load bet data
    const fetchBet = () => {
      try {
        const betData = getBetById(parseInt(id));
        if (betData) {
          setBet(betData);
        } else {
          setError('Bet not found');
        }
      } catch (err) {
        setError('Failed to load bet details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBet();
  }, [id]);
  
  const handleParticipantAdded = (updatedBet) => {
    // Update local state with the updated bet data
    setBet(updatedBet);
  };
  
  const handleActivityLogged = (updatedBet) => {
    // Update local state with the updated bet data
    setBet(updatedBet);
  };
  
  if (loading) {
    return <div className="text-center py-5">Loading bet details...</div>;
  }
  
  if (error) {
    return (
      <Alert color="danger" className="my-4">
        {error}
        <div className="mt-3">
          <Button color="secondary" onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </div>
      </Alert>
    );
  }
  
  if (!bet) {
    return (
      <Alert color="warning" className="my-4">
        Bet not found
        <div className="mt-3">
          <Button color="secondary" onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </div>
      </Alert>
    );
  }
  
  const startDate = new Date(bet.startDate).toLocaleDateString();
  const endDate = new Date(bet.endDate).toLocaleDateString();
  const isActive = new Date() >= new Date(bet.startDate) && new Date() <= new Date(bet.endDate);
  
  return (
    <div>
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h3">{bet.name}</CardTitle>
          
          <CardText className="mb-1">
            <strong>Duration:</strong> {startDate} to {endDate}
          </CardText>
          
          <CardText className="mb-1">
            <strong>Status:</strong>{' '}
            <span className={isActive ? 'text-success' : 'text-secondary'}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </CardText>
          
          <CardText className="mb-1">
            <strong>Participants:</strong> {bet.participants.length}
          </CardText>
          
          <div className="mt-3">
            <Button color="secondary" onClick={() => navigate('/home')}>
              Back to Home
            </Button>
          </div>
        </CardBody>
      </Card>
      
      <Row>
        <Col md={6}>
          <ParticipantForm 
            betId={bet.id} 
            onParticipantAdded={handleParticipantAdded} 
          />
          
          <ParticipantsList bet={bet} />
        </Col>
        
        <Col md={6}>
          <DailyCheckIn 
            bet={bet} 
            onActivityLogged={handleActivityLogged} 
          />
        </Col>
      </Row>
    </div>
  );
};

export default BetDetails;