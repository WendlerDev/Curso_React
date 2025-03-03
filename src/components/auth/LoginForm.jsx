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
    
    // Form validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsSubmitting(true);
    
    // Authenticate user
    const result = authenticateUser(username, password);
    
    if (result.success) {
      // Redirect to home page on successful login
      navigate('/home');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="mx-auto" style={{ maxWidth: '400px' }}>
      <CardBody>
        <CardTitle tag="h4" className="text-center mb-4">Login to BetTracker</CardTitle>
        
        {error && <Alert color="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          
          <Button
            color="primary"
            block
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
          
          <div className="mt-3 text-center">
            <small className="text-muted">
              Try username: user123, password: pass123
            </small>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default LoginForm;