import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert, Card, CardBody, CardTitle } from 'reactstrap';
import { logDailyActivity } from '../../utils/betsService';
import { getCurrentUser } from '../../utils/auth';

const DailyCheckIn = ({ bet, onActivityLogged }) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [forbiddenTasks, setForbiddenTasks] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const currentUser = getCurrentUser();
  
  // Check if current user is a participant
  const isParticipant = bet.participants.some(p => p.userId === currentUser?.id);
  
  // Handle checkbox change for positive tasks
  const handlePositiveTaskChange = (taskId) => {
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };
  
  // Handle checkbox change for negative tasks
  const handleNegativeTaskChange = (taskId) => {
    setForbiddenTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!currentUser) {
      setError('You must be logged in to check in');
      return;
    }
    
    if (!isParticipant) {
      setError('You are not a participant in this bet');
      return;
    }
    
    const result = logDailyActivity(
      bet.id,
      currentUser.id,
      date,
      completedTasks,
      forbiddenTasks
    );
    
    if (result.success) {
      setSuccess('Daily check-in recorded successfully!');
      setCompletedTasks([]);
      setForbiddenTasks([]);
      
      // Notify parent component that activity was logged
      if (onActivityLogged) {
        onActivityLogged(result.bet);
      }
    } else {
      setError(result.message);
    }
  };
  
  // If user is not a participant, don't show the form
  if (!isParticipant) {
    return (
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h5">Daily Check-In</CardTitle>
          <Alert color="info">
            You need to join this bet before you can check in daily activities.
          </Alert>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle tag="h5">Daily Check-In</CardTitle>
        
        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="date">Date</Label>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={bet.startDate}
              max={bet.endDate}
            />
          </FormGroup>
          
          <FormGroup tag="fieldset">
            <legend className="small font-weight-bold">Positive Tasks (+1 point each)</legend>
            {bet.tasks.positive.map(task => (
              <FormGroup check key={task.id}>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={completedTasks.includes(task.id)}
                    onChange={() => handlePositiveTaskChange(task.id)}
                  />
                  {task.name}
                </Label>
              </FormGroup>
            ))}
          </FormGroup>
          
          <FormGroup tag="fieldset" className="mt-3">
            <legend className="small font-weight-bold">Negative Tasks (-1 point each)</legend>
            {bet.tasks.negative.map(task => (
              <FormGroup check key={task.id}>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={forbiddenTasks.includes(task.id)}
                    onChange={() => handleNegativeTaskChange(task.id)}
                  />
                  {task.name}
                </Label>
              </FormGroup>
            ))}
          </FormGroup>
          
          <Button color="primary" type="submit" className="mt-3">
            Submit Check-In
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default DailyCheckIn;