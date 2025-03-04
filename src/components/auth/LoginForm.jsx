import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert, Card, CardBody, CardTitle } from 'reactstrap';
import { authenticateUser } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Form validacao
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setIsSubmitting(true);

    // Autenticacao de usuario
    const result = authenticateUser(username, password);

    if (result.success) {
      // Redirect para login
      navigate('/home');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: '400px' }}>
      <CardBody>
        <CardTitle tag="h4" className="text-center mb-4">Faca o login em BetTracker</CardTitle>

        {error && <Alert color="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="username">Usuario</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entre seu usuario"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="password">Senha</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Coloque sua senha"
              required
            />
          </FormGroup>

          <Button
            color="primary"
            block
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logando...' : 'Login'}
          </Button>

          <div className="mt-3 text-center">
            <small className="text-muted">
              Tente: user123, senha: pass123
            </small>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default LoginForm;