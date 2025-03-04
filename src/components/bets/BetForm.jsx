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

    // Limpar erro ao editar o campo
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
      newErrors.name = 'Nome da aposta requerida';
    }

    if (!betData.startDate) {
      newErrors.startDate = 'Data de início requerida';
    } else if (betData.startDate < today) {
      newErrors.startDate = 'Data não pode estar no passado';
    }

    if (!betData.endDate) {
      newErrors.endDate = 'Data final requerida';
    } else if (betData.endDate <= betData.startDate) {
      newErrors.endDate = 'Data final deve ser depois da data inicial';
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
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrors({ form: 'Falha ao criar aposta, tente novamente.' });
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h4" className="mb-4">Criar nova aposta</CardTitle>

        {errors.form && <Alert color="danger">{errors.form}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Nome da aposta</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={betData.name}
              onChange={handleChange}
              placeholder="e.g., Desafio dos 30 dias"
              invalid={!!errors.name}
            />
            {errors.name && <div className="text-danger small">{errors.name}</div>}
          </FormGroup>

          <FormGroup>
            <Label for="startDate">Data inicial</Label>
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
            <Label for="endDate">Data final</Label>
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
            {isSubmitting ? 'Criando...' : 'Aposta criada'}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default BetForm;