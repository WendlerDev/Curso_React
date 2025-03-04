import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { addParticipantToBet } from '../../utils/betsService';
import { getCurrentUser } from '../../utils/auth';
import users from '../../data/users.json';

const ParticipantForm = ({ betId, onParticipantAdded }) => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Set usuario como default
    if (currentUser) {
      setUserId(currentUser.id.toString());
    }

    // Filtrar usuarios que já estão na aposta
    // aqui seria uma conexao com api
    setAvailableUsers(users);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId) {
      setError('Selecione um usuário');
      return;
    }

    const result = addParticipantToBet(betId, parseInt(userId));

    if (result.success) {
      setSuccess('Participante adicionado com sucesso');
      setUserId('');

      // Notificar participante adicionado
      if (onParticipantAdded) {
        onParticipantAdded(result.bet);
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="mb-4">
      <h5>Adicionar participante</h5>

      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}

      <Form onSubmit={handleSubmit} inline>
        <FormGroup className="mb-2 mr-2">
          <Label for="userId" className="mr-2">Select User</Label>
          <Input
            type="select"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Selecione...</option>
            {availableUsers.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </Input>
        </FormGroup>

        <Button color="primary" type="submit" className="ml-2">
          Adicionar a aposta
        </Button>
      </Form>
    </div>
  );
};

export default ParticipantForm;