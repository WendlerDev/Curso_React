import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Alert, Card, CardBody, CardTitle } from 'reactstrap';
import { createBet } from '../../utils/betsService';
import { useNavigate } from 'react-router-dom';

const BetForm = () => {
  const [betData, setBetData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBetData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    const today = new Date().toISOString().split('T')[0];
    
    if (!betData.name.trim()) {
      newErrors.name = 'Bet name is required';
    }
    
    if (!betData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (betData.startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }
    
    if (!betData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (betData.endDate <= betData.startDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newBet = createBet(betData);
      navigate(`/bet/${newBet.id}`);
    } catch (error) {
      setErrors({ form: 'Failed to create bet. Please try again.' });
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4" className="mb-4">Create New Bet</CardTitle>
        
        {errors.form && <Alert color="danger">{errors.form}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Bet Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={betData.name}
              onChange={handleChange}
              placeholder="e.g., 30 Day Fitness Challenge"
              invalid={!!errors.name}
            />
            {errors.name && <div className="text-danger small">{errors.name}</div>}
          </FormGroup>
          
          <FormGroup>
            <Label for="startDate">Start Date</Label>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={betData.startDate}
              onChange={handleChange}
              invalid={!!errors.startDate}
            />
            {errors.startDate && <div className="text-danger small">{errors.startDate}</div>}
          </FormGroup>
          
          <FormGroup>
            <Label for="endDate">End Date</Label>
            <Input
              type="date"
              id="endDate"
              name="endDate"
              value={betData.endDate}
              onChange={handleChange}
              invalid={!!errors.endDate}
            />
            {errors.endDate && <div className="text-danger small">{errors.endDate}</div>}
          </FormGroup>
          
          <Button
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Bet'}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default BetForm;