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

  // Checar se usuario é participante
  const isParticipant = bet.participants.some(p => p.userId === currentUser?.id);

  // Handle box para apostas positivas
  const handlePositiveTaskChange = (taskId) => {
    setCompletedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  // Handle box para apostas negativas
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
      setError('Você precisa estar logado');
      return;
    }

    if (!isParticipant) {
      setError('Você não é um participante desta aposta');
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
      setSuccess('Aposta gravada com sucesso');
      setCompletedTasks([]);
      setForbiddenTasks([]);


      if (onActivityLogged) {
        onActivityLogged(result.bet);
      }
    } else {
      setError(result.message);
    }
  };

  // se o usuario nao for participante, não mostrará o form
  if (!isParticipant) {
    return (
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h5">Check diário</CardTitle>
          <Alert color="info">
            Você precisa participar dessa aposta para poder fazer o check diário.
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle tag="h5">Check diário</CardTitle>

        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="date">Data</Label>
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
            <legend className="small font-weight-bold">Apostas positivas(+1 point each)</legend>
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
            <legend className="small font-weight-bold">Apostas negativas(-1 point each)</legend>
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
            Submeter check-in
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default DailyCheckIn;