import React from 'react';
import { Card, CardBody, CardTitle, CardText, Button, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';

const BetCard = ({ bet }) => {
  const startDate = new Date(bet.startDate).toLocaleDateString();
  const endDate = new Date(bet.endDate).toLocaleDateString();
  const isActive = new Date() >= new Date(bet.startDate) && new Date() <= new Date(bet.endDate);

  return (
    <Card className="mb-3 h-100">
      <CardBody className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <CardTitle tag="h5">{bet.name}</CardTitle>
          <Badge color={isActive ? 'sucesso' : 'secundario'}>
            {isActive ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>

        <CardText>
          <strong>Duração:</strong> {startDate} - {endDate}
        </CardText>

        <CardText>
          <strong>Participantes:</strong> {bet.participants.length}
        </CardText>

        <div className="mt-auto pt-3">
          <Button
            color="primary"
            tag={Link}
            to={`/bet/${bet.id}`}
            block
          >
            Ver detalhes
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default BetCard;